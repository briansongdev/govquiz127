import {
  AlertDialog,
  AlertDialogBody,
  Spinner,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Center,
  Text,
  Heading,
} from "@chakra-ui/react";
import { useRef } from "react";
import Lottie from "lottie-react";
import check from "../public/check.json";

export default function CustomSpinner({ isOpen, onOpen, onClose, extraText }) {
  const cancelRef = useRef();

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogBody>
              <Center>
                <Text fontWeight="bold">{extraText}</Text>
              </Center>
              <Lottie animationData={check} loop={0} />
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
