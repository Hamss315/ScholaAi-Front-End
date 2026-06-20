import api from "../api";

export const getSubjects = async () => {
  const response = await api.get("/Admin/subjects");
  return response.data;
};
