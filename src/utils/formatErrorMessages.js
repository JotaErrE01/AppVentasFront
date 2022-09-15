
export const formatErrorMessages = (errors) => {
  // const errorsMessages = [];
  return errors.map((data) => {
    data.json_response = JSON.parse(data.json_response || "{}");
    if(data.respuesta_json?.listadoErrores) {
      data.respuesta_json.listadoErrores = [...data.respuesta_json.listadoErrores].map(({ descripcion }) => {
        // errorsMessages.push(descripcion);
        return descripcion;
      });
    }

    data.json_value = JSON.parse(data.json_value || "{}");

    return data;
  });
}
