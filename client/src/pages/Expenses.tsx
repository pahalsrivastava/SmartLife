// no React import needed with react-jsx
import { useExpenseStore } from '../stores/expenses';

export default function Expenses() {
  const { expenses, deleteExpense } = useExpenseStore();
  return (
    <div>
      <h2>Expenses</h2>
      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            {e.name} - ${e.amount} - {e.category}{' '}
            <button onClick={() => deleteExpense(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
