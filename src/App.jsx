import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";

function App() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();
  const mortgageType = useWatch({ control, name: "mortgageType" });
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalRepayment, setTotalRepayment] = useState(null);

  // Prevent pasting negative values into the input fields
  //Credit: https://stackoverflow.com/questions/68531963/how-to-block-negative-values-in-input-tags-while-entering-in-forms :)
  
  const preventPasteNegative = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = parseFloat(clipboardData.getData("text"));

    if (pastedData < 0) {
      e.preventDefault();
    }
  };

  const preventMinus = (e) => {
    if (e.code === "Minus") {
      e.preventDefault();
    }
  };

  function onSubmit(data) {
    const amount = Number(data.amount);
    const term = Number(data.term);
    const interestRate = Number(data.interestRate);
    const { mortgageType } = data;

    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = term * 12;

    let monthlyPayment;

    if (mortgageType === "repayment") {
      monthlyPayment =
        (amount * monthlyInterestRate) /
        (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    } else if (mortgageType === "interest-only") {
      monthlyPayment = amount * monthlyInterestRate;
    }

    if (monthlyPayment) {
      setMonthlyPayment(
        monthlyPayment.toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      );
      setTotalRepayment(
        (monthlyPayment * numberOfPayments).toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      );
    } else {
      setMonthlyPayment(null);
      setTotalRepayment(null);
    }
  }

  return (
    <main className="font-plus sm:landscape:min-h-screen sm:landscape:flex sm:landscape:items-center sm:landscape:justify-center sm:landscape:bg-slate-100 sm:landscape:p-6 lg:bg-slate-100 lg:min-h-screen lg:flex lg:items-center lg:justify-center lg:p-6">
      <div className="sm:landscape:flex sm:landscape:w-full sm:landscape:max-w-2xl sm:landscape:shadow-xl sm:landscape:rounded-2xl sm:landscape:overflow-hidden lg:flex lg:w-full lg:max-w-4xl lg:shadow-xl lg:rounded-3xl lg:overflow-hidden lg:items-stretch">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white w-full p-6 max-w-sm mx-auto mt-8 lg:max-w-none lg:mx-0 lg:mt-0 lg:flex-1 lg:p-8 sm:landscape:rounded-l-2xl sm:landscape:shadow-lg sm:landscape:p-8"
        >
          <h1 className="text-2xl font-bold text-slate-700">
            Mortgage Calculator
          </h1>
          <button
            type="button"
            className="mt-4 text-slate-500 hover:text-slate-700"
            onClick={() => {
              reset();
              setMonthlyPayment(null);
              setTotalRepayment(null);
            }}
          >
            <span className="underline cursor-pointer">Clear All</span>
          </button>

          <label
            htmlFor="mortgage-amount"
            className="block mb-2 mt-4 text-slate-700 font-medium"
          >
            Mortgage Amount
          </label>
          <div
            className={`flex border rounded overflow-hidden focus-within:border-slate-400 mb-4 ${errors.amount ? "border-red-300" : "border-slate-300 focus-within:border-slate-400"}`}
          >
            <span
              className={`px-3 py-2 select-none font-semibold ${errors.amount ? "bg-red-300 border-red-300 text-red-500" : "bg-slate-300 border-slate-300 text-slate-500"}`}
            >
              £
            </span>
            <input
              id="mortgage-amount"
              type="number"
              min="0"
              onKeyDown={preventMinus}
              onPaste={preventPasteNegative}
              className="flex-1 px-3 py-2 outline-none bg-white"
              placeholder="Eg: £200,000"
              {...register("amount", { required: true, min: 100000 })}
            />
          </div>
          {errors.amount?.type === "required" && (
            <p className="text-red-500 text-xs mb-3">
              Please enter a valid mortgage amount.
            </p>
          )}
          {errors.amount?.type === "min" && (
            <p className="text-red-500 text-xs mb-3">
              The minimmum mortgage amount is £100,000.
            </p>
          )}
          <label
            htmlFor="mortgage-term"
            className="block mb-2 mt-4 text-slate-700 font-medium"
          >
            Mortgage Term
          </label>
          <div
            className={`flex border rounded overflow-hidden focus-within:border-slate-400 mb-4 flex-row-reverse ${errors.term ? "border-red-300" : "border-slate-300 focus-within:border-slate-400"}`}
          >
            <span
              className={`px-3 py-2 select-none font-semibold ${errors.term ? "bg-red-300 border-red-300 text-red-500" : "bg-slate-300 border-slate-300 text-slate-500"}  `}
            >
              years
            </span>
            <input
              id="mortgage-term"
              type="number"
              className="flex-1 px-3 py-2 outline-none bg-white"
              placeholder="Eg: 25"
              {...register("term", { required: true, min: 20 })}
            />
          </div>
          {errors.term?.type === "required" && (
            <p className="text-red-500 text-xs mt-1">
              Please enter a valid term.
            </p>
          )}
          {errors.term?.type === "min" && (
            <p className="text-red-500 text-xs mt-1">
              The minimum mortgage term is 20 years.
            </p>
          )}
          <label
            htmlFor="interest-rate"
            className="block mb-2 mt-4 text-slate-700 font-medium"
          >
            Interest Rate
          </label>
          <div
            className={`flex border  rounded overflow-hidden focus-within:border-slate-400 mb-4 flex-row-reverse ${errors.interestRate ? "border-red-300" : "border-slate-300 focus-within:border-slate-400"}`}
          >
            <span
              className={`px-3 py-2 select-none font-semibold ${errors.interestRate ? "bg-red-300 border-red-300 text-red-500" : "bg-slate-300 border-slate-300 text-slate-500"}`}
            >
              %
            </span>
            <input
              id="interest-rate"
              type="number"
              className="flex-1 px-3 py-2 outline-none bg-white"
              placeholder="Eg: 3.5%"
              step="any"
              {...register("interestRate", { required: true, min: 1 })}
            />
          </div>
          {errors.interestRate?.type === "required" && (
            <p className="text-red-500 text-xs mt-1">
              Please enter a valid interest rate ( eg: 3.5 for 3.5% ).
            </p>
          )}
          {errors.interestRate?.type === "min" && (
            <p className="text-red-500 text-xs mt-1">
              The minimum interest rate is 1%.
            </p>
          )}
          <fieldset>
            <legend className="block mb-2 mt-4 text-slate-700 font-medium">
              Mortgage Type
            </legend>
            <div
              className={`flex items-center mb-2 space-x-4 border rounded p-3 ${mortgageType === "repayment" ? "border-lime-500 bg-lime-200" : "border-slate-300"}`}
            >
              <input
                type="radio"
                className="accent-blue-500"
                id="repayment"
                name="mortgage-type"
                value="repayment"
                {...register("mortgageType", { required: true })}
              />
              <label htmlFor="repayment">Repayment</label>
            </div>
            <div
              className={`flex items-center mb-2 space-x-4 border rounded p-3 ${mortgageType === "interest-only" ? "border-lime-500 bg-lime-200" : "border-slate-300"}`}
            >
              <input
                type="radio"
                className="accent-blue-500"
                id="interest-only"
                name="mortgage-type"
                value="interest-only"
                {...register("mortgageType", { required: true })}
              />
              <label htmlFor="interest-only">Interest Only</label>
            </div>
            {errors.mortgageType?.type === "required" && (
              <p className="text-red-500 text-xs mt-1">
                Please select a mortgage type.
              </p>
            )}
          </fieldset>
          <button
            type="submit"
            className="cursor-pointer mt-6 w-full bg-lime-300 hover:bg-lime-400 text-slate-700 font-bold py-3 px-4 rounded-full flex items-center justify-center gap-3"
          >
            <span>
              <img src="/images/icon-calculator.svg" />
            </span>
            Calculate Repayments
          </button>
        </form>
        {monthlyPayment ? (
          <section className="bg-slate-900 w-full p-6 rounded text-center sm:landscape:rounded-r-2xl sm:landscape:w-full sm:landscape:max-w-md sm:landscape:flex sm:landscape:flex-col sm:landscape:items-center sm:landscape:justify-center sm:landscape:gap-6 lg:max-w-none lg:mx-0 lg:mt-0 lg:flex-1 lg:rounded-none lg:rounded-bl-[80px]">
            <h1 className="text-white font-semibold text-xl text-left">
              Your Results
            </h1>
            <p className="text-slate-400 font-medium text-left mt-2">
              Your results are shown below based on the information you
              provided. To adjust the results, simply change the form values and
              click "calculate repayments" again.
            </p>
            <div className="mt-6 bg-slate-800 p-6 rounded flex flex-col items-start border-t-4 rounded-t border-lime-500 gap-2">
              <p className="text-white font-semibold text-base">
                Your monthly repayments
              </p>
              <span className="text-lime-300 text-4xl font-bold">{`£${monthlyPayment}`}</span>
              <hr className="w-full border border-slate-700 m-2" />
              <p className="text-white font-semibold text-base">
                Total you'll repay over the term
              </p>
              <span className="text-lime-300 text-2xl font-bold">{`£${totalRepayment}`}</span>
            </div>
          </section>
        ) : (
          <section className="bg-slate-900 w-full p-6 mt-8 sm:landscape:rounded-r-2xl sm:landscape:w-full sm:landscape:max-w-md sm:landscape:flex sm:landscape:flex-col sm:landscape:items-center sm:landscape:justify-center sm:landscape:gap-6 lg:max-w-none lg:mx-0 lg:mt-0 lg:flex-1 lg:rounded-none lg:rounded-bl-[80px]">
            <div className="flex flex-col items-center justify-center py-6">
              <img src="/images/illustration-empty.svg" alt="" />
            </div>
            <p className="text-white font-semibold text-xl text-center">
              Results shown here
            </p>
            <p className="text-slate-400 font-medium text-center mt-2">
              Complete the form and click "calculate repayments" to see what
              your monthly repayments would be.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
