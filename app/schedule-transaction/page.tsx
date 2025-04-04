import { CalendarClock } from "lucide-react";
import AddScheduledTransactionButton from "./_components/add-schedule-transaction-button";

const ScheduleTransaction = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        <div className="overflow-hidden rounded-xl shadow-lg">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <CalendarClock className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Programar Transação</h1>
                <p className="text-sm">
                  Programe transações recorrentes para facilitar seu dia-a-dia
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <AddScheduledTransactionButton userCanAddTransaction />
            </div>
          </div>

          <div className="p-6"></div>
        </div>
      </div>
    </div>
  );
};
export default ScheduleTransaction;
