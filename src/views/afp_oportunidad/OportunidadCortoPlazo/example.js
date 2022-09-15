import React, { useState } from "react";
import { render } from "react-dom";
import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import _ from "lodash";
import "./style.css";
import Checkbox from "./checkbox";
import FieldLabel from "./fieldlabel";
// The editor core
import Editor from "@react-page/editor";
import "@react-page/core/lib/index.css"; // we also want to load the stylesheets
// Require editor ui stylesheet
import "@react-page/ui/lib/index.css";

// Load some exemplary plugins:
import slate from "@react-page/plugins-slate"; // The rich text area plugin
import "@react-page/plugins-slate/lib/index.css"; // Stylesheets for the rich text area plugin
import background from "@react-page/plugins-background"; // A plugin for background images
import image from "@react-page/plugins-image";
import "@react-page/plugins-background/lib/index.css"; // Stylesheets for  background layout plugin

// Define which plugins we want to use. We only have slate and background available, so load those.
const plugins = {
  content: [slate()], // Define plugins for content cells. To import multiple plugins, use [slate(), image, spacer, divider]
  layout: [background({ defaultPlugin: slate() }), image] // Define plugins for layout cells
};
const initialValues = {
  friends: [],
  testHidden: ""
};

export class Friend {
  constructor() {
    this.name = "";
    this.email = "";
    this.includeAge = false;
    this.age = null;
  }
}
export const validateSchema = Yup.object().shape({
    friends: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .required("Name is required"),
            email: Yup.string()
                .email("Invalid email")
                .required("Please enter email"),
            includeAge: Yup.bool(),
            extra: Yup.mixed()
                .when(["name"], {
                is: (name) => {
                    return name.length === 0;
                },
                then: Yup.string().required("Please enter extr")
                }),
            age: Yup.mixed()
                .when("includeAge", {
                is: true,
                then: Yup.number()
                    .nullable()
                    .transform((value) => (isNaN(value) ? undefined : value))
                    .required("Age is required"),
                otherwise: Yup.number().nullable()
                })
        })
    )
    .min(1, "Need at least a friend")
});
const InviteFriends = () => {
  // const [editorValue, setEditorValue] = useState();
  return (
    <div className={"container"}>
      <h1 className="mb-4">
        <a href={"https://github.com/jaredpalmer/formik"}>Formik</a> FieldArray
        With <a href={"https://github.com/jquense/yup"}>Yup</a> validation
      </h1>
      <code>
        <h2>Formik: Build forms in React, without the tears.</h2>
        <h2>But I will help you cry less, I believe</h2>
      </code>
      <h2>Invite friends App</h2>
      <p>Features:</p>
      <ol>
        <li>
          Check the <code>touched, erorrs, values</code> state in the right side
        </li>
        <li>
          It indicates <code>touched.friends: []</code> but one value was
          actually touched
        </li>
        <li>
          Validate relate field <code>includeAge and age</code>
        </li>
      </ol>
      {/* <Editor plugins={plugins} value={editorValue} onChange={setEditorValue} /> */}
      <Formik
        initialValues={initialValues}
        validationSchema={validateSchema}
        onSubmit={(values) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
          }, 500);
        }}
        render={({ values, errors, touched, handleReset, setFieldValue }) => {
          return (
            <Form>
              <div className="row">
                <input type="text" name="testHidden" hidden />
                <div className="col-6">
                  <FieldArray
                    name="friends"
                    render={({ insert, remove, push }) => (
                      <div className={"mb-1"}>
                        {values.friends.length > 0 &&
                          values.friends.map((friend, index) => (
                            <div className="row mb-3 d-flex align-items-center" key={index} >
                              <div className="col-10">
                                <div className="">
                                  <label htmlFor={`friends.${index}.name`}>
                                    Name
                                  </label>
                                  <Field className="form-control" name={`friends.${index}.name`} placeholder="name" type="text" />
                                  {errors && errors.friends && errors.friends[index] && errors.friends[index].name && touched && touched.friends && touched.friends[index] && touched.friends[index].name && (
                                      <div className="field-error">
                                        {errors.friends[index].name}
                                      </div>
                                    )}
                                </div>
                                <div className="">
                                  <label htmlFor={`friends.${index}.email`}>
                                    Email
                                  </label>

                                  <Field
                                    className="form-control"
                                    name={`friends.${index}.email`}
                                    placeholder="email"
                                    type="email"
                                  />
                                  {errors &&
                                    errors.friends &&
                                    errors.friends[index] &&
                                    errors.friends[index].email &&
                                    touched &&
                                    touched.friends &&
                                    touched.friends[index] &&
                                    touched.friends[index].email && (
                                      <div className="field-error">
                                        {errors.friends[index].email}
                                      </div>
                                    )}
                                </div>

                                <div className={""}>
                                  <Field
                                    label={"Include Age"}
                                    type="checkbox"
                                    component={Checkbox}
                                    name={`friends.${index}.includeAge`}
                                    checked={values.friends[index].includeAge}
                                    onChange={() => {
                                      console.log(
                                        values.friends[index].includeAge
                                      );

                                      setFieldValue(
                                        `friends.${index}.includeAge`,
                                        !values.friends[index].includeAge
                                      );
                                    }}
                                  />
                                </div>
                                <FieldLabel
                                  hidden={
                                    values.friends[index].includeAge === false
                                  }
                                  label="Age"
                                  placeHolder={"Age"}
                                  name={`friends.${index}.age`}
                                  type="number"
                                  error={
                                    errors &&
                                    errors.friends &&
                                    errors.friends[index] &&
                                    errors.friends[index].age
                                  }
                                  touched={
                                    touched &&
                                    touched.friends &&
                                    touched.friends[index] &&
                                    touched.friends[index].age
                                  }
                                />
                              </div>
                              <div className="col-2">
                                <button
                                  type="button"
                                  className="btn-danger"
                                  onClick={() => remove(index)}
                                >
                                  X
                                </button>
                              </div>
                            </div>
                          ))}
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => push(new Friend())}
                        >
                          Add Friend
                        </button>
                      </div>
                    )}
                  />
                </div>
                <div className="col-6">
                  <button
                    className="btn btn-block btn-warning"
                    onClick={(event) => {
                      event.preventDefault();
                      handleReset();
                    }}
                  >
                    Reset
                  </button>
                  <button type="submit" className="btn btn-block btn-primary">
                    Submit
                  </button>
                  {errors &&
                    _.isString(errors.friends) &&
                    touched &&
                    _.isArray(touched.friends) && (
                      <div className="field-error">{errors.friends}</div>
                    )}
                  <div className={"row"}>
                    <div className={"col-12"}>
                      <code>
                        <pre>Values: {JSON.stringify(values, null, 2)}</pre>
                      </code>
                    </div>
                    <div className={"col-12"}>
                      <pre>Errors: {JSON.stringify(errors, null, 2)}</pre>
                    </div>
                    <div className={"col-12"}>
                      <pre>Touched: {JSON.stringify(touched, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      />
    </div>
  );
};

render(<InviteFriends />, document.getElementById("root"));
