// src/screens/VehicleReceiverQuizScreen.tsx
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
    question: "What is the main responsibility of a Vehicle Receiver?",
    options: [
      "To provide medical treatment",
      "To guide emergency vehicles to the scene and ensure clear access",
      "To operate the AED machine",
      "To secure the perimeter"
    ],
    correctAnswerIndex: 1, // "To guide emergency vehicles to the scene and ensure clear access"
  },
  {
    id: 2,
    question: "Why is it important to ensure clear access for emergency vehicles?",
    options: [
      "To make the scene look professional",
      "To allow them to arrive quickly and deploy resources efficiently",
      "To avoid traffic fines",
      "To give bystanders a good view"
    ],
    correctAnswerIndex: 1, // "To allow them to arrive quickly and deploy resources efficiently"
  },
  {
    id: 3,
    question: "What should you do if there are obstacles blocking the path of an emergency vehicle?",
    options: [
      "Ignore them and wait for the vehicle to find its way",
      "Attempt to clear them if safe and possible, or direct the vehicle to an alternative route",
      "Tell the driver to go around",
      "Call for more help to remove the obstacle"
    ],
    correctAnswerIndex: 1, // "Attempt to clear them if safe and possible, or direct the vehicle to an alternative route"
  },
];

const VehicleReceiverQuizScreen: React.FC = () => {
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

export default VehicleReceiverQuizScreen;