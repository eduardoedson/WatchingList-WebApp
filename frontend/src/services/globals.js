export const rowKeys = ["watching", "waiting", "completed"];

export const leftPad = (value, totalWidth, paddingChar = "0") => {
  if (value.toString().length < totalWidth) {
    const length = totalWidth - value.toString().length + 1;
    return Array(length).join(paddingChar) + value;
  }
  return value;
};

export const formatDate = (date) => {
  try {
    return date.split("T")[0].split("-").reverse().join("/");
  } catch (e) {
    console.log("FormatDate Error === ", e);
    return date;
  }
};

export const backToTop = () =>
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

export const backToItem = (id) =>
  document
    .getElementById(id)
    .scrollIntoView({ block: "center", behavior: "smooth" });
