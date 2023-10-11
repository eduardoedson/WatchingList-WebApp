import axios from "axios";

const Backend = axios.create({ baseURL: "localhost:4000" });

const getWatching = async (category) => {
  return await Backend.get(`/get/${category}/false/false`).then(
    (response) => response.data.items
  );
};

const getWaiting = async (category) => {
  let ret = [];
  await Backend.get(`/get/${category}/true/false`).then((response) => {
    const temp = [...ret, ...response.data.items];
    ret = temp;
  });
  await Backend.get(`/get/${category}/true/true`).then((response) => {
    const temp = [...ret, ...response.data.items];
    ret = temp;
  });
  return ret;
};

const getCompleted = async (category) => {
  let ret = [];
  await Backend.get(`/get/${category}/false/true`).then((response) => {
    const temp = [...ret, ...response.data.items];
    ret = temp;
  });

  await Backend.get(`/get/${category}/true/true`).then((response) => {
    const temp = [...ret, ...response.data.items];
    ret = temp;
  });

  return ret;
};

export const getItems = async (category) => {
  if (category) {
    const watching = await getWatching(category);
    const waiting = await getWaiting(category);
    const completed = await getCompleted(category);
    return { watching, waiting, completed };
  }
  return { watching: [], waiting: [], completed: [] };
};

export const storeItem = async (body, setFormfeedback) => {
  return await Backend.post("/store", body)
    .then(() => {
      if (setFormfeedback) {
        setFormfeedback({ type: "success", msg: "Item criado" });
      }
      return getItems(body.category);
    })
    .catch((response) => {
      if (setFormfeedback) {
        setFormfeedback({ type: "error", msg: response.message });
      }
      console.log("Store Error === ", response);
      return null;
    });
};

export const updateItem = async (id, body, setFormfeedback = null) => {
  return await Backend.put(`/update/${id}`, body)
    .then(() => {
      if (setFormfeedback) {
        setFormfeedback({ type: "success", msg: "Item editado" });
      }
      return getItems(body.category);
    })
    .catch((response) => {
      if (setFormfeedback) {
        setFormfeedback({ type: "error", msg: response.message });
      }
      console.log("Update Error === ", response);
      return null;
    });
};

export const destroyItem = async (id, category) => {
  return await Backend.delete(`/destroy/${id}`)
    .then(() => getItems(category))
    .catch((response) => {
      console.log("Destroy error === ", response);
    });
};
