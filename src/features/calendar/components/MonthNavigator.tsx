interface Props {
  month: Date;
  onPrev: () => void;
  onNext: () => void;
}

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function MonthNavigator({ month, onPrev, onNext }: Props) {
  return (
    <div className="flex justify-between items-center">
      <button onClick={onPrev}>◀</button>

      <h2>
        {monthNames[month.getMonth()]} {month.getFullYear()}
      </h2>

      <button onClick={onNext}>▶</button>
    </div>
  );
}