import { useEffect, useState } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [views, setViews] = useState("");
  const [posts, setPosts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [url, setUrl] = useState("http://localhost:3000/posts");

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, [url]);

  const addPost = () => {
    const newPost = {
      title,
      views: Number(views),
      completed: false,
    };

    if (editId !== null) {
      fetch(`http://localhost:3000/posts/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      })
        .then((res) => res.json())
        .then((data) => {
          setPosts(posts.map((p) => (p.id === editId ? data : p)));
          setTitle("");
          setViews("");
          setEditId(null);
        });

      return;
    }

    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts([...posts, data]);
        setTitle("");
        setViews("");
      });
  };

  const deletePost = (id) => {
    fetch(`http://localhost:3000/posts/${id}`, {
      method: "DELETE",
    }).then(() => {
      setPosts(posts.filter((p) => p.id !== id));
    });
  };

  const editPost = (post) => {
    setTitle(post.title);
    setViews(post.views);
    setEditId(post.id);
  };

  return (
    <>
      <div className="px-5 py-5">
        <h1 className="text-6xl text-center font-bold">API CRUD Operations</h1>
        <hr className="my-4" />
        <input
          className="border-2 border-black m-4 p-3 rounded"
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border-2 border-black m-4 p-3 rounded"
          type="number"
          placeholder="Enter Views"
          value={views}
          onChange={(e) => setViews(e.target.value)}
        />

        <button
          className="m-2 px-4 rounded text-white py-3 bg-blue-400"
          onClick={addPost}
        >
          {editId ? "Update Post" : "Add Post"}
        </button>

        <div>
          <button
            onClick={() => setUrl("http://localhost:3000/posts?completed=true")}
            className="m-2 px-4 rounded text-white py-3 bg-green-400"
          >
            Completed
          </button>
          <button
            onClick={() =>
              setUrl("http://localhost:3000/posts?completed=false")
            }
            className="m-2 px-4 rounded text-white py-3 bg-red-400"
          >
            Not Completed
          </button>
        </div>

        <hr />

        {posts.map((p) => (
          <div key={p.id} className="mx-4">
            <h2 className="text-2xl px-3 font-bold">{p.title}</h2>
            <p className="font-semibold px-3">Views:- {p.views}</p>
            <h2 className="font-semibold px-3">
              {p.completed ? (
                <span style={{ color: "green", fontSize: "20px" }}>
                  Completed
                </span>
              ) : (
                <span style={{ color: "red", fontSize: "20px" }}>
                  Not Completed
                </span>
              )}
            </h2>

            <button
              onClick={() => editPost(p)}
              className="m-2 px-4 rounded bg-green-400"
            >
              Edit
            </button>

            <button
              onClick={() => deletePost(p.id)}
              className="m-2 px-4 rounded bg-red-400"
            >
              Delete
            </button>

            <hr />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
