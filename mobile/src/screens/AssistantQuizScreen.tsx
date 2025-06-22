// src/screens/AssistantQuizScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What is a primary duty of an Assistant during an emergency?",
    options: [
      "Solely perform CPR throughout the incident",
      "Direct emergency vehicles",
      "Provide assistance where required, such as taking over CPR when others are fatigued",
      "Manage crowd control"
    ],
    correctAnswerIndex: 2, // "Provide assistance where required, such as taking over CPR when others are fatigued"
  },
  {
    id: 2,
    question: "When might an Assistant be given special tasks?",
    options: [
      "Only if they are the most experienced CFR",
      "To receive paramedics at hard-to-reach places",
      "To go home and rest",
      "To call the casualty's family"
    ],
    correctAnswerIndex: 1, // "To receive paramedics at hard-to-reach places"
  },
  {
    id: 3,
    question: "An Assistant's role is primarily about:",
    options: [
      "Leading the entire emergency response",
      "Providing supportive functions and flexibility",
      "Calling 995",
      "Documenting the incident"
    ],
    correctAnswerIndex: 1, // "Providing supportive functions and flexibility"
  },
];

const AssistantQuizScreen: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const navigation = useNavigation();

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswerIndex(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswerIndex === null) {
      Alert.alert("Please select an answer", "You must choose an option before submitting.");
      return;
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (selectedAnswerIndex === currentQuestion.correctAnswerIndex) {
      setScore(prevScore => prevScore + 1);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswerIndex(null); // Reset for next question
    } else {
      setQuizCompleted(true);
      const finalScore = score + (selectedAnswerIndex === currentQuestion.correctAnswerIndex ? 1 : 0);
      const passScore = quizQuestions.length; // 3/3 for pass
      if (finalScore === passScore) {
        Alert.alert("Quiz Completed!", `You scored ${finalScore}/${quizQuestions.length}. Great job! You passed!`, [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert("Quiz Completed!", `You scored ${finalScore}/${quizQuestions.length}. Keep practicing!`, [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    }
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {!quizCompleted ? (
          <View style={styles.quizContainer}>
            <Text style={styles.questionNumber}>Question {currentQuestion.id} of {quizQuestions.length}</Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswerIndex === index && styles.selectedOptionButton,
                ]}
                onPress={() => handleAnswerSelect(index)}
              >
                <Text style={[
                  styles.optionText,
                  selectedAnswerIndex === index && styles.selectedOptionText,
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitAnswer}
            >
              <Text style={styles.submitButtonText}>
                {currentQuestionIndex === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null }
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  quizContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  questionNumber: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  optionButton: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AssistantQuizScreen;