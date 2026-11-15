"use client";

import dynamic from "next/dynamic";

const LottieSkeleton = () => (
  <div className="mx-auto w-full max-w-[288px] aspect-square rounded-full bg-muted/40 animate-pulse" />
);

const createLottie = (importJson: () => Promise<{ default: object }>) =>
  dynamic(
    async () => {
      const [Lottie, json] = await Promise.all([
        import("lottie-react").then((m) => m.default),
        importJson().then((m) => m.default),
      ]);
      return {
        default: () => <Lottie animationData={json} loop />,
      };
    },
    {
      ssr: false,
      loading: LottieSkeleton,
    },
  );

const lottieMap = {
  notFound: createLottie(() => import("../assets/animation/notFound.json")),
  empty: createLottie(() => import("../assets/animation/empty.json")),
  error: createLottie(() => import("../assets/animation/error.json")),
};

interface LottieHandlerProps {
  type: keyof typeof lottieMap;
  message?: string;
}

const LottieHandler = ({ type, message }: LottieHandlerProps) => {
  const AnimationComponent = lottieMap[type];

  return (
    <div className="mx-auto w-full max-w-xs text-center">
      <AnimationComponent />

      {message && (
        <h3
          className={`mt-5 text-lg font-medium ${
            type === "error" ? "text-destructive" : "text-muted-foreground"
          } break-words whitespace-pre-wrap`}
        >
          {message}
        </h3>
      )}
    </div>
  );
};

export default LottieHandler;
