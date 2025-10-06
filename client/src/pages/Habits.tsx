// no React import needed with react-jsx
import { useHabitStore } from '../stores/habits';

export default function Habits() {
  const { habits, toggleToday, deleteHabit } = useHabitStore();
  return (
    <div>
      <h2>Habits</h2>
      <ul>
        {habits.map((h) => (
          <li key={h.id}>
            <b>{h.name}</b> ({h.frequency}){' '}
            <button onClick={() => toggleToday(h.id)}>Toggle Today</button>{' '}
            <button onClick={() => deleteHabit(h.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
