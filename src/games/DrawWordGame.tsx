import React, { PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Eraser, Pencil, Volume2 } from 'lucide-react';
import { GameProps } from '../types';
import { GAME_COPY } from '../data/gameCopy';
import { GameProgress, EmptyGame } from './GameProgress';
import { useGameProgress } from './useGameProgress';
import { useSpeech } from '../hooks/useSpeech';

type Stroke = Array<{ x: number; y: number }>;

export const DrawWordGame: React.FC<GameProps> = ({
  words,
  language,
  onCorrect,
  onWrong,
  onComplete,
  introSpoken = false,
}) => {
  const questions = useMemo(() => words.slice(0, 4), [words]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const { recordAnswer, finish } = useGameProgress('draw_word', { onCorrect, onWrong, onComplete });
  const { speak } = useSpeech();
  const copy = GAME_COPY[language];
  const question = questions[questionIndex];

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const ratio = window.devicePixelRatio || 1;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 5;
    context.strokeStyle = '#0f766e';
    strokesRef.current.forEach(stroke => {
      if (!stroke.length) return;
      context.beginPath();
      context.moveTo(stroke[0].x, stroke[0].y);
      stroke.slice(1).forEach(point => context.lineTo(point.x, point.y));
      context.stroke();
    });
    context.setTransform(1, 0, 0, 1, 0, 0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(bounds.width * ratio);
      canvas.height = Math.round(bounds.height * ratio);
      redrawCanvas();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!introSpoken || !question) return;
    const timeout = window.setTimeout(() => speak(copy.drawWordHint, language), 250);
    return () => window.clearTimeout(timeout);
  }, [copy.drawWordHint, introSpoken, language, question, speak]);

  useEffect(() => {
    if (!submitted || !question) return;
    const timeout = window.setTimeout(() => {
      if (questionIndex + 1 >= questions.length) {
        finish(questions.map(word => word.id));
        return;
      }
      setQuestionIndex(index => index + 1);
      setStrokes([]);
      strokesRef.current = [];
      setSubmitted(false);
      redrawCanvas();
    }, 800);
    return () => window.clearTimeout(timeout);
  }, [finish, question, questionIndex, questions, submitted]);

  if (!question) return <EmptyGame language={language} />;

  const pointerPosition = (event: PointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  };

  const startStroke = (event: PointerEvent<HTMLCanvasElement>) => {
    if (submitted) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    strokesRef.current = [...strokesRef.current, [pointerPosition(event)]];
    setStrokes(strokesRef.current);
    redrawCanvas();
  };

  const drawStroke = (event: PointerEvent<HTMLCanvasElement>) => {
    if (submitted || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const current = [...strokesRef.current];
    const active = current[current.length - 1];
    if (!active) return;
    active.push(pointerPosition(event));
    strokesRef.current = current;
    setStrokes(current);
    redrawCanvas();
  };

  const clearCanvas = () => {
    strokesRef.current = [];
    setStrokes([]);
    redrawCanvas();
  };

  const submitDrawing = () => {
    if (submitted || strokes.length === 0) return;
    setSubmitted(true);
    recordAnswer(question, true, question, false);
    speak(`${copy.drawFinished} ${question.text}`, language);
  };

  return (
    <section
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-3xl rounded-[2rem] bg-[#fffdf4] p-4 shadow-[0_18px_45px_rgba(63,115,64,.14)] ring-1 ring-lime-100 sm:p-6"
    >
      <GameProgress current={questionIndex + 1} total={questions.length} label={copy.drawWordProgress} icon="✎" language={language} />
      <div className="mb-4 rounded-3xl bg-gradient-to-br from-amber-100 via-white to-teal-100 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-teal-800">{copy.drawWordTitle}</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-4xl">{question.translation}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-700">{copy.drawWordHint}</p>
          </div>
          <button
            type="button"
            onClick={() => speak(question.audioText || question.text, language)}
            aria-label={copy.listen}
            className="flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-white px-4 font-extrabold text-teal-900 shadow-sm hover:bg-teal-50"
          >
            <Volume2 size={20} aria-hidden="true" /><span className="hidden sm:inline">{copy.listen}</span>
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-teal-300 bg-white">
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-12 px-5" aria-hidden="true">
          <div className="border-b border-slate-200" />
          <div className="border-b border-slate-200" />
        </div>
        <canvas
          ref={canvasRef}
          aria-label={copy.drawCanvasLabel}
          className="relative z-10 block h-56 w-full touch-none sm:h-72"
          onPointerDown={startStroke}
          onPointerMove={drawStroke}
          onPointerUp={event => event.currentTarget.releasePointerCapture(event.pointerId)}
          onPointerCancel={event => event.currentTarget.releasePointerCapture(event.pointerId)}
        />
      </div>

      {submitted && (
        <p aria-live="polite" className="mt-3 text-center text-xl font-black text-emerald-800">
          {copy.drawFinished} {question.text}
        </p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={clearCanvas}
          disabled={submitted || strokes.length === 0}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 font-extrabold text-slate-700 disabled:opacity-50"
        >
          <Eraser className="h-5 w-5" aria-hidden="true" /> {copy.drawClear}
        </button>
        <button
          type="button"
          onClick={submitDrawing}
          disabled={submitted || strokes.length === 0}
          className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 font-black text-white shadow-[0_4px_0_#0f766e] disabled:bg-slate-300 disabled:shadow-none"
        >
          <Pencil className="h-5 w-5" aria-hidden="true" /> {copy.drawDone}
        </button>
      </div>
    </section>
  );
};
