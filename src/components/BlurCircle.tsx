type BlurCircleProp = {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
};

const BlurCircle = ({
  top = "auto",
  left = "auto",
  right = "auto",
  bottom = "auto",
}: BlurCircleProp) => {
  return (
    <div
      className="absolute -z-50 w-56 h-56 aspect-square rounded-full bg-primary/30 blur-3xl"
      style={{
        top: top,
        left: left,
        right: right,
        bottom: bottom,
      }}
    >
      BlurCircle
    </div>
  );
};

export default BlurCircle;
