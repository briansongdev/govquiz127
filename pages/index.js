import {
  Button,
  ButtonGroup,
  Container,
  Heading,
  HStack,
  Progress,
  Switch,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import CustomSpinner from "../components/spinner";
import clientPromise from "../lib/mongodb";
import axios from "axios";
import { RepeatIcon } from "@chakra-ui/icons";

export async function getServerSideProps(context) {
  try {
    const client = await clientPromise;
    const db = client.db("apgov127");
    let result;
    await db
      .collection("metrics")
      .findOne({})
      .then((res) => {
        result = res;
        result = JSON.stringify(result);
      });
    return {
      props: { result },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}

export default function Home({ result }) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [question, setQuestion] = useState(0);
  const [taken, setTaken] = useState(false);
  const [showDesc, changeShow] = useState(false);
  const questionDesc = [
    "What was Citizens United in the context of the case?",
    "Which constitutional issue dominated Citizens United v. FEC’s ruling, and why?",
    "What was the primary legislation that Citizens United was originally challenging?",
  ];
  const answers = [
    [
      "Grassroots environmental nonprofit dedicated to creating change in communities",
      "Republican business conducting illegal operations in election fraud",
      "Conservative nonprofit releasing a disparaging film on Hillary Clinton",
      "Collection of volunteers spreading advocacy for voting",
    ],
    [
      "9th Amendment - Citizens United, the “people,” desired more rights in express advocacy",
      "1st Amendment - Corporate contributions wanted “free speech” over their monetary spending of election-related content",
      "Commerce Clause - Congress deserved more power in regulating commerce in terms of campaign finance",
      "Necessary and Proper Clause - Congress deserved more power in regulating commerce in terms of campaign finance",
    ],
    [
      "Federal Election Campaign Act of 1971",
      "26th Amendment",
      "19th Amendment",
      "Bipartisan Campaign Reform Act of 2002",
    ],
  ];
  const letters = [2, 1, 3];
  const [score, setScore] = useState(0);
  const [canRe, setCanRe] = useState(true);
  const setAnswer = async (choice) => {
    console.log(choice);
    if (letters[question] == choice) {
      // right answer
      onOpen();
      if (canRe) {
        setScore(Math.min(3, score + 1));
        await axios.post("/api/submit", {
          questionNumber: question,
          correct: true,
        });
      } else {
        await axios.post("/api/submit", {
          questionNumber: question,
          correct: false,
        });
      }
      setTimeout(async () => {
        onClose();
        setCanRe(true);
        if (question == 2) {
          setTaken(true);
          localStorage.setItem("quiz_taken", "true");
        } else {
          setQuestion(question + 1);
        }
      }, 2000);
    } else {
      toast({
        title: "Try again.",
        description: "Your answer was incorrect.",
        status: "error",
        duration: 2000,
        position: "top",
      });
      setCanRe(false);
    }
  };
  useEffect(() => {
    setTaken(localStorage.getItem("quiz_taken") ? true : false);
  }, []);
  return (
    <Container maxW="80%">
      <CustomSpinner
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        extraText={"Nice job! You are correct."}
      />
      <HStack alignItems="end">
        <span
          style={{
            color: "black",
            fontWeight: "bold",
            fontSize: "32px",
            padding: "0em 0.2em",
            backgroundImage:
              "linear-gradient(to bottom, transparent 50%, #008080 50%)",
          }}
        >
          <span id="textGradient">AP GOV</span>
        </span>
        <Text textDecorationLine="underline">3 MCQ Quiz</Text>
      </HStack>
      <VStack alignItems="start">
        <Text>Brian, Tej, Saif, Jaideep</Text>
        <HStack alignSelf="center">
          <Text display={{ base: "none", md: "block" }}>
            Show question description
          </Text>
          <Switch
            isChecked={showDesc}
            colorScheme="teal"
            size="lg"
            display={{ base: "none", md: "block" }}
            onChange={(e) => {
              changeShow(e.target.checked);
            }}
          />
        </HStack>
        <Container
          alignSelf="center"
          textAlign="center"
          padding="10px"
          maxW="90%"
          borderRadius="15"
          bg="gray.100"
        >
          {taken ? (
            <>
              <Heading>Thank you for taking our quiz!</Heading>
              {score > 0 ? (
                <Text>Your score of {score} / 3 has been submitted.</Text>
              ) : (
                <></>
              )}
              <Text fontWeight="bold">
                Here are classwide accuracy results.
              </Text>
              <VStack spacing={4} mt="20px">
                <HStack w="100%" spacing={6}>
                  <Text>Question 1: </Text>
                  <Progress
                    colorScheme="teal"
                    width="80%"
                    height="20px"
                    borderRadius="100px"
                    backgroundColor="white"
                    isAnimated
                    hasStripe
                    value={
                      (JSON.parse(result).a0 * 100) / JSON.parse(result).q0
                    }
                  />
                  <Text>
                    {Math.floor(
                      (JSON.parse(result).a0 * 100) / JSON.parse(result).q0
                    )}
                    %
                  </Text>
                </HStack>
                <HStack w="100%" spacing={6}>
                  <Text>Question 2: </Text>
                  <Progress
                    colorScheme="teal"
                    width="80%"
                    height="20px"
                    borderRadius="100px"
                    backgroundColor="white"
                    isAnimated
                    hasStripe
                    value={
                      (JSON.parse(result).a1 * 100) / JSON.parse(result).q1
                    }
                  />
                  <Text>
                    {Math.floor(
                      (JSON.parse(result).a1 * 100) / JSON.parse(result).q1
                    )}
                    %
                  </Text>
                </HStack>
                <HStack w="100%" spacing={6}>
                  <Text>Question 3: </Text>
                  <Progress
                    colorScheme="teal"
                    width="80%"
                    height="20px"
                    borderRadius="100px"
                    backgroundColor="white"
                    isAnimated
                    hasStripe
                    value={
                      (JSON.parse(result).a2 * 100) / JSON.parse(result).q2
                    }
                  />
                  <Text>
                    {Math.floor(
                      (JSON.parse(result).a2 * 100) / JSON.parse(result).q2
                    )}
                    %
                  </Text>
                </HStack>
                <Button
                  leftIcon={<RepeatIcon />}
                  colorScheme="teal"
                  variant="solid"
                  onClick={() => {
                    window.location.reload(false);
                  }}
                >
                  Refresh
                </Button>
              </VStack>
            </>
          ) : (
            <>
              <Heading>Question {question + 1}</Heading>
              <Text fontWeight="bold">{questionDesc[question]}</Text>
              <VStack padding="15px" spacing={4}>
                <Button
                  colorScheme="teal"
                  width="90%"
                  height="75px"
                  onClick={() => setAnswer(0)}
                >
                  {showDesc ? answers[question][0] : "A"}
                </Button>
                <Button
                  colorScheme="orange"
                  width="90%"
                  height="75px"
                  onClick={() => setAnswer(1)}
                >
                  {showDesc ? answers[question][1] : "B"}
                </Button>
                <Button
                  colorScheme="pink"
                  width="90%"
                  height="75px"
                  onClick={() => setAnswer(2)}
                >
                  {showDesc ? answers[question][2] : "C"}
                </Button>
                <Button
                  colorScheme="blue"
                  width="90%"
                  height="75px"
                  onClick={() => setAnswer(3)}
                >
                  {showDesc ? answers[question][3] : "D"}
                </Button>
              </VStack>
            </>
          )}
        </Container>
        <Text textAlign="right">brian</Text>
      </VStack>
    </Container>
  );
}
