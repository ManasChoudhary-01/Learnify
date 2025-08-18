import React, { useState, useEffect } from "react";
import styles from './searchscreen.module.scss';

import { Formik, Field, Form } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import ToastContainer from "../../helper/ToastContainer";

export default function SearchScreen() {

    const [enabled, setEnabled] = useState(false);
    const [course, setCourse] = useState("");

    const initialValues = {
        promptMessage: "",
        currentLevel: "",
        targetLevel: "",
        hours: "",
        weeks: "",
    };

    const levelOptions = [
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Advanced", label: "Advanced" },
        { value: "Expert", label: "Expert" }
    ];

    // useEffect(() => {
    //     if(promptMessage.length() !== 0) {
    //         setEnabled(true);
    //     }
    // },[promptMessage]);

    const handlePromptSubmit = async (values , {resetForm}) => {

        try {
            const response = await toast.promise(
                axios.post("https://httpbin.org/post", values, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }),
                {
                    pending: "Sending request...",
                    success: "Request sent successfully!",
                    error: "Error while sending request"
                }
            );

            setCourse(response.data);
            console.log(response.data);
            resetForm();

        } catch (error) {
            console.log("Error while fetching the course details:", error);
        }
    }

    useEffect(() => {
        const onKeyDown = (e) => {
            if ((e.key === 'Enter' || e.code === 'NumpadEnter') && enabled) {
                e.preventDefault();
                handlePromptSubmit;
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [enabled, handlePromptSubmit]);

    return (
        <div className={styles.mainContainer}>
            <ToastContainer />
            <h2>What can I help you learn?</h2>
            <h4>Create personalized learning paths tailored to your schedule and goals</h4>
            <div className={styles.searchContainer}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handlePromptSubmit}
                    // onSubmit={(values) => console.log(values)}
                >
                    {({ values, setFieldValue }) => (
                        <Form className={styles.formContainer}>
                            <div className={styles.input}>
                                <label htmlFor="promptMessage">What can I help to learn?</label>
                                <Field
                                    name="promptMessage"
                                    as="textarea"
                                    placeholder="Enter a topic"
                                    className={styles.textArea}
                                    onInput={(e) => {
                                        e.target.style.height = "auto"; // reset
                                        e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`; // grow till 200px
                                    }}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setFieldValue("promptMessage", v);
                                        if (v.trim()) {
                                            setEnabled(true)
                                        } else {
                                            setEnabled(false)
                                        }
                                    }}
                                />
                            </div>

                            <div className={styles.input}>
                                <label htmlFor="currentLevel">Current Level</label>
                                <div className={styles.checkboxContainer}>
                                    {levelOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className={`${values.currentLevel === option.value ? styles.checked : ""
                                                } ${styles.checkboxLabel}`}
                                            htmlFor={`currentLevel-${option.value}`}
                                            onClick={() => {
                                                setFieldValue("currentLevel", option.value);
                                            }}
                                        >
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.input}>
                                <label htmlFor="targetLevel">Target Level</label>
                                <div className={styles.checkboxContainer}>
                                    {levelOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className={`${values.targetLevel === option.value ? styles.checked : ""
                                                } ${styles.checkboxLabel}`}
                                            htmlFor={`targetLevel-${option.value}`}
                                            onClick={() => {
                                                setFieldValue("targetLevel", option.value);
                                            }}
                                        >
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.weekDetails}>
                                <div className={styles.input}>
                                    <label htmlFor="hours">Hours per Week</label>
                                    <Field
                                        name="hours"
                                        type="number"
                                        placeholder="e.g. 5"
                                        className={styles.inputField}
                                    />
                                </div>
                                <div className={styles.input}>
                                    <label htmlFor="weeks">Number of Weeks</label>
                                    <Field
                                        name="weeks"
                                        type="number"
                                        placeholder="e.g. 10"
                                        className={styles.inputField}
                                    />
                                </div>
                            </div>

                            <div className={styles.buttonContainer}>
                                <button type="submit" disabled={!enabled}>
                                    Generate
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
