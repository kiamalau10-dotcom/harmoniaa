import { useState, useEffect } from "react";

const questions = [
  {
    question: "Menurut Durkheim, harmoni sosial terbentuk karena...",
    options: [
      "Kesamaan latar belakang",
      "Nilai dan norma bersama",
      "Tidak ada konflik",
      "Kebebasan individu",
    ],
    answer: 1,
  },
  {
    question: "Menurut Weber, harmoni sosial menekankan...",
    options: [
      "Keseragaman",
      "Kekuasaan",
      "Pemahaman perbedaan",
      "Ekonomi",
    ],
    answer: 2,
  },
];

export default function Quiz() {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selected, setSelected] = useState<number | null>(null);

  // TIMER
  useEffect(() => {
    if (!started) return;

    if (timeLeft === 0) {
      console.log("Waktu habis → lanjut soal");
      nextQuestion();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, started]);

  // DEBUG STATE
  useEffect(() => {
    console.log("STATE UPDATE:", {
      current,
      score,
      timeLeft,
      selected,
    });
  }, [current, score, timeLeft, selected]);

  const handleAnswer = (index: number) => {
    if (selected !== null) return; // cegah spam klik

    setSelected(index);

    if (index === questions[current].answer) {
      console.log("Jawaban benar");
      setScore((s) => s + 10);
    } else {
      console.log("Jawaban salah");
    }

    setTimeout(() => {
      nextQuestion();
    }, 1000);
  };

  const nextQuestion = () => {
    setSelected(null);
    setTimeLeft(10);

    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
    } else {
      alert(`Selesai! Skor: ${score}`);
      resetQuiz();
    }
  };

  const resetQuiz = () => {
    setStarted(false);
    setCurrent(0);
    setScore(0);
    setTimeLeft(10);
    setSelected(null);
    setName("");
  };

  if (!started) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Mulai Kuis</h2>
        <input
          placeholder="Masukkan nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />
        <button onClick={() => setStarted(true)}>Mulai</button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div style={{ padding: 20 }}>
      <h3>Nama: {name}</h3>
      <h4>Soal {current + 1}</h4>
      <p>{q.question}</p>

      <p>Waktu: {timeLeft}s</p>

      {q.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => handleAnswer(i)}
          style={{
            display: "block",
            margin: "10px 0",
            background:
              selected === null
                ? "#eee"
                : i === q.answer
                ? "green"
                : i === selected
                ? "red"
                : "#eee",
            color: selected !== null ? "#fff" : "#000",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}