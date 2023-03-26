import 'react-pdf/dist/esm/Page/TextLayer.css';
import './questionstyle.css';

import type {
  GetQuestionResp as Question,
  PostAnswerResp,
} from '@backend/core/types';
import type { AxiosRequestConfig } from 'axios';
import axios, { HttpStatusCode } from 'axios';
import { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useForm } from 'react-hook-form';
import { Document, Page, pdfjs } from 'react-pdf';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce } from 'usehooks-ts';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import { useUser } from '../../contexts/user';
import http from '../../http';

type Answer = Question['answers'][number];

const QuestionPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const id: Question['id'] = Number(params.id);
  const [question, setQuestion] = useState<Question | null>(null);

  const fetchQuestion = useCallback(async () => {
    try {
      const res = await http.public.get<Question>(`/api/questions/${id}`);
      setQuestion(res.data);
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err?.response?.status === HttpStatusCode.UnprocessableEntity
      ) {
        navigate('/');
      }
    }
  }, [id, navigate]);

  useEffectOnce(() => {
    fetchQuestion();
  });

  return question ? (
    <Container>
      <h1 className="text-white">{question.title}</h1>
      <p className="text-white">{question.body}</p>
      <Container>
        <AddAnswer question={question} fetchQuestion={fetchQuestion} />
      </Container>
      <Container>
        {question.answers.map((answer) => (
          <AnswerComponent
            answer={answer}
            key={answer.id}
            isSelectedAnswer={question.selectedAnswerId === answer.id}
            fetchQuestion={fetchQuestion}
          />
        ))}
      </Container>
    </Container>
  ) : (
    <p className="text-white">wait lol</p>
  );
};

interface WriteAnswerFormData {
  answer: {
    text: string;
    files: FileList;
  };
}

const FORM_DATA_HEADERS = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
} satisfies AxiosRequestConfig;

const AddAnswer = ({
  question,
  fetchQuestion,
}: {
  question: Question;
  fetchQuestion: () => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WriteAnswerFormData>();
  const user = useUser();

  const isInputDisabled = !user;
  const userAnswer = question?.answers.find(
    (a) => user?.id && a.authorId === user.id,
  );
  const hasUserAnswered = !!userAnswer;

  const onSubmit = async (data: WriteAnswerFormData) => {
    if (!user || !question) {
      return;
    }

    const file =
      data.answer.files?.length === 1 ? data.answer.files.item(0) : null;

    const patchData = { answer: { text: data.answer.text }, file };
    if (hasUserAnswered) {
      await http.private.patch(
        `/api/answers/${userAnswer.id}`,
        patchData,
        FORM_DATA_HEADERS,
      );
    } else {
      const postData = { answer: { text: data.answer.text } };
      const postResp = await http.private.post<PostAnswerResp>(
        `/api/questions/${question.id}/answers`,
        postData,
      );
      if (file) {
        await http.private.patch(
          `/api/answers/${postResp.data.id}`,
          patchData,
          FORM_DATA_HEADERS,
        );
      }
    }
    fetchQuestion();
  };

  return (
    <Form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <Row>
        <Col>
          <Form.Group>
            <Form.Control
              as="textarea"
              placeholder={
                hasUserAnswered ? 'update your answer' : 'add an answer'
              }
              {...register('answer.text', {
                required: true,
                minLength: {
                  value: 6,
                  message: 'answer needs to be meaningful',
                },
              })}
              isInvalid={'text' in (errors?.answer ?? {})}
            />
            <Form.Control.Feedback type="invalid">
              {errors.answer?.text?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Control
              type="file"
              disabled={isInputDisabled}
              accept="application/pdf"
              {...register('answer.files')}
            />
          </Form.Group>
        </Col>
        <Col>
          <Button variant="primary" type="submit" disabled={isInputDisabled}>
            {hasUserAnswered ? 'update' : 'submit'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const AnswerComponent = ({
  answer,
  isSelectedAnswer,
  fetchQuestion,
}: {
  answer: Answer;
  isSelectedAnswer?: boolean;
  fetchQuestion: () => Promise<void>;
}) => {
  const user = useUser();
  const answerBelongsToUser = answer.authorId === user?.id;

  const onDelete = async () => {
    if (answerBelongsToUser) {
      await http.private.delete(`/api/answers/${answer.id}`);
      fetchQuestion();
    }
  };

  const deleteButton = answerBelongsToUser && (
    <Button variant="danger" type="submit" onClick={onDelete}>
      delete
    </Button>
  );

  const file = `data:application/pdf;base64,${answer.file}`;
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [renderNavButtons, setRenderNavButtons] = useState(false);

  const changePage = (offset: number) => {
    const newPageNumber = pageNumber + offset;
    if (newPageNumber >= 1 && newPageNumber <= numPages) {
      setPageNumber(newPageNumber);
    }
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setRenderNavButtons(true);
  }

  return (
    <Container>
      <Row className={isSelectedAnswer ? 'bg-primary' : undefined}>
        <Col>
          <h3 className="text-white">{answer.text}</h3>
          <p className="text-white">posted by {answer.author.email}</p>

          {answer.file && (
            <>
              <div>
                {renderNavButtons && (
                  <div>
                    <Button
                      disabled={pageNumber <= 1}
                      onClick={previousPage}
                      variant="light"
                    >
                      previous
                    </Button>
                    {'  '}
                    <Button
                      disabled={pageNumber === numPages}
                      onClick={nextPage}
                      variant="light"
                    >
                      next
                    </Button>
                  </div>
                )}
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page pageNumber={pageNumber} renderTextLayer={false} />
                </Document>
              </div>
            </>
          )}
          {}
        </Col>
        <Col>{deleteButton}</Col>
      </Row>
    </Container>
  );
};

export default QuestionPage;
