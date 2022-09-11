import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

export default function StartQuiz() {
    const { category, limit } = useParams();
    const [questions, setQuestions] = useState([]);
    const [actualQuestionIndex, setActualQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizEnd, setQuizEnd] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState();
    const [btnNextDisabled, setBtnNextDisabled] = useState(true);

    useEffect(() => {
        fetch(`/api/v1/questions?category=${category}&limit=${limit}`)
            .then((res) => res.json())
            .then((data) => setQuestions(data))
            .catch((err) => console.log(err.message));
    }, []);

    return (
        <Container className="text-center my-auto">
            <div>
                {quizEnd ? (
                    <>
                        <h1 className="mt-4 mb-4">{category.toUpperCase()}</h1>
                        <h1 className="mb-4">
                            Puntuación: {score} de {questions.length}{" "}
                        </h1>
                    </>
                ) : (
                    <>
                        <h1 className="mt-4 mb-4">{category.toUpperCase()}</h1>
                        <h2>
                            Pregunta {actualQuestionIndex + 1} de{" "}
                            {questions.length}{" "}
                        </h2>
                        <h2 className="mb-4">
                            {" "}
                            Puntuación: {score} de {questions.length}
                        </h2>
                        <div className="mb-3">
                            {questions.map((question, index) => {
                                if (index == actualQuestionIndex) {
                                    return (
                                        <h2 className="text-center text-break mb-4">
                                            {question.question}
                                        </h2>
                                    );
                                }
                            })}
                        </div>
                        <div>
                            {questions.map((question, index) => {
                                if (index == actualQuestionIndex) {
                                    return (
                                        <div className="d-grid mb-2">
                                            {Object.keys(question.answers).map(((key) => {
                                                const value = question.answers[key];
                                                return (
                                                    <Button
                                                        className="mt-2 fs-5 fw-semibold bg-warning text-dark border-0 text-break shadow"
                                                        disabled={btnDisabled}
                                                        size="lg"
                                                        onClick={(e) => {
                                                            if (key === question.correct_answer) {
                                                                e.target.classList.replace("bg-warning", "bg-success");
                                                                setBtnDisabled(true);
                                                                setScore(score + 1);
                                                            } else {
                                                                e.target.classList.replace("bg-warning", "bg-danger");
                                                                setBtnDisabled(true);
                                                            }
                                                            setBtnNextDisabled(false);
                                                            if (actualQuestionIndex == questions.length - 1) {
                                                                setBtnNextDisabled(true);
                                                                setTimeout(() => {
                                                                    setQuizEnd(true)
                                                                }, 2000);
                                                            }
                                                        }}>
                                                        {value}
                                                    </Button>
                                                );
                                            }))}
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </>
                )}
            </div>
            <div className="d-grid">
                {quizEnd ? (
                    <>
                        <Link to={`/startQuiz/${category}/${limit}`}>
                            <Button
                                className="w-100 fs-5 fw-bold shadow mb-4 mt-2"
                                variant="primary"
                                onClick={() => {
                                    setActualQuestionIndex(0);
                                    setQuizEnd(false);
                                    setScore(0);
                                    setBtnDisabled(false);
                                }}
                            >
                                REPETIR QUIZ
                            </Button>
                        </Link>
                        <Link to="/quiz">
                            <Button
                                className="w-100 fs-5 fw-bold shadow"
                                variant="primary"
                            >
                                SALIR
                            </Button>
                        </Link>
                    </>
                ) : (
                    <Button
                        variant="primary"
                        className="fs-5 fw-bold mb-2 shadow"
                        size="lg"
                        disabled={btnNextDisabled}
                        onClick={() => {
                            setActualQuestionIndex(actualQuestionIndex + 1);
                            setBtnDisabled(false);
                            setBtnNextDisabled(true);
                        }}
                    >
                        SIGUIENTE
                    </Button>
                )}
            </div>
        </Container>
    );
}
