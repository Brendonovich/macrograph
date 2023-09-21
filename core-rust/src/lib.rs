use axum::extract::Query;
use base64::prelude::*;
use rspc::{
    alpha::{AlphaRouter, Rspc},
    Config, Router,
};
use serde::Serialize;
use serde_json::json;
use specta::Type;

#[allow(non_upper_case_globals)]
pub(self) const R: Rspc<()> = Rspc::new();

pub fn router() -> Router {
    R.router()
        .merge("fs.", fs())
        .merge("oauth.", oauth())
        .build(Config::new().export_ts_bindings(
            std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../core/src/core.ts"),
        ))
}

pub fn oauth() -> AlphaRouter<()> {
    R.router().procedure(
        "authorize",
        R.mutation(|_, url: String| async move {
            use axum::*;

            let (tx, mut rx) = tokio::sync::mpsc::channel(4);

            #[derive(serde::Deserialize)]
            struct Response {
                token: String,
            }

            // build our application with a route
            let app = <Router>::new()
                .layer(tower_http::cors::CorsLayer::very_permissive())
                .route(
                    "/",
                    routing::get(|Query(resp): Query<Response>| async move {
                        tx.send(
                            serde_json::from_slice::<serde_json::Value>(
                                &BASE64_STANDARD.decode(resp.token).unwrap(),
                            )
                            .unwrap(),
                        )
                        .await
                        .expect("no send?!");
                        "You can return to macrograph!"
                    }),
                );

            let addr = format!(
                "127.0.0.1:{}",
                cfg!(debug_assertions).then_some(1820).unwrap_or(0)
            )
            .parse()
            .unwrap();

            let (shutdown_tx, shutdown_rx) = tokio::sync::oneshot::channel::<()>();

            let server = axum::Server::bind(&addr).serve(app.into_make_service());

            let port = server.local_addr().port();

            tokio::spawn(async move {
                server
                    .with_graceful_shutdown(async {
                        shutdown_rx.await.ok();
                    })
                    .await
                    .unwrap();
            });

            opener::open(format!(
                "{}?state={}",
                url,
                base64::prelude::BASE64_STANDARD.encode(
                    &serde_json::to_string(&json!({
                        "env": "desktop",
                        "port": port
                    }))
                    .unwrap()
                ),
            ))
            .expect("Failed to open twitch URL!");

            let response = rx.recv().await;

            shutdown_tx.send(()).ok();

            response
        }),
    )
}

pub fn fs() -> AlphaRouter<()> {
    #[derive(Type, Serialize)]
    enum Entry {
        Dir(String),
        File(String),
    }

    R.router().procedure(
        "list",
        R.query(|_, path: String| async move {
            std::fs::read_dir(path)
                .unwrap()
                .map(|e| {
                    let e = e.unwrap();
                    let path = e.path();
                    let path = path.file_name().unwrap().to_str().unwrap().to_string();
                    if e.file_type().unwrap().is_dir() {
                        Entry::Dir(path)
                    } else {
                        Entry::File(path)
                    }
                })
                .collect::<Vec<_>>()
        }),
    )
}
