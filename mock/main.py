from fastapi import FastAPI

app = FastAPI()


@app.get(
    "/",
    tags=["root"],
    summary="Root",
    description="Root with a description",
    operation_id="read_root",
    response_description="Root response",
)
def read_root():
    return {"Hello": "World"}


@app.get(
    "/items/{item_id}",
    summary="Get item by ID",
    description="Get item by ID with a description",
    tags=["items"],
    operation_id="get_item",
)
def read_item(item_id: int, q: str):
    return {"item_id": item_id, "q": q}


@app.get(
    "/items/{item_id}/description",
    summary="Get item by ID",
    description="Get item by ID with a description",
    tags=["items"],
    operation_id="get_item_description",
)
def read_item_description(item_id: int, description: str):
    return {"item_id": item_id, "description": description}


@app.post(
    "/items/{item_id}",
    tags=["items"],
    operation_id="post_item",
    summary="Post item by ID",
    description="Post item by ID with a description",
)
def post_item(item_id: int, q: str):
    return {"item_id": item_id, "q": q}
