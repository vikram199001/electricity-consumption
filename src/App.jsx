import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery, gql } from "@apollo/client";
import { Chart } from "react-google-charts";
import moment from "moment";
import "./App.css";
const DATA = [
  {
    timestamp: "2023-01-01T00:00:00+01:00",
    value: 308.5306,
  },
  {
    timestamp: "2023-02-01T00:00:00+01:00",
    value: 278.6728,
  },
  {
    timestamp: "2023-03-01T00:00:00+01:00",
    value: 308.5306,
  },
  {
    timestamp: "2023-04-01T00:00:00+02:00",
    value: 298.578,
  },
  {
    timestamp: "2023-05-01T00:00:00+02:00",
    value: 135.7321,
  },
  {
    timestamp: "2023-06-01T00:00:00+02:00",
    value: 18.7929,
  },
  {
    timestamp: "2023-07-01T00:00:00+02:00",
    value: 49.644,
  },
  {
    timestamp: "2023-08-01T00:00:00+02:00",
    value: 384.741,
  },
  {
    timestamp: "2023-09-01T00:00:00+02:00",
    value: 372.33,
  },
  {
    timestamp: "2023-10-01T00:00:00+02:00",
    value: 388.1143,
  },
  {
    timestamp: "2023-11-01T00:00:00+01:00",
    value: 8.355,
  },
  {
    timestamp: "2023-12-01T00:00:00+01:00",
    value: 8.6335,
  },
];

export const options = {
  title: "Electricity Consumption",
  curveType: "function",
  legend: { position: "bottom" },
};
const LOGIN_QUERY = gql`
  {
    login(
      credentials: {
        username: "vikram.singh24@live.com"
        password: "aS1RilrjXJT9j2gREVqu04ZXY9OBZ"
      }
    ) {
      token
    }
  }
`;

const ELECTRICITY_CONSUMPTION = gql`
  query GetConsumption($token: TOKEN!, $from: FROM!, $to: TO!) {
    user(token: $token, from: $from , to: $to) {
      treeNode(id: 3) {
        name
        type
        meters {
          name
          type
          function
          data(
            from: $from
            to: $to
            interval: Month
          ) {
            timestamp
            value
          }
        }
      }
    }
  }
`;

function App() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const { data: loginData, loading: loginLoading, error: loginError } = useQuery(LOGIN_QUERY);

  useEffect(() => {
    if(loginError){
      alert("Please recheck your username and password")
    }
  }, [loginError])
  const { login = {} } = loginData;
  const { token = "" } = login;
  const { loading, error, data } = useQuery(ELECTRICITY_CONSUMPTION, {
    variables: { token, from: fromDate, to: toDate  },
  });
  const outputData = DATA.map(Object.values);
  const chartData = [["Monthly", "Consumption"]];
  outputData.map((item) => {
    const date = item[0];
    const myMomentObject = moment(date, "YYYY-MM-DD");
    item[0] = myMomentObject.format("Do MMM YY").toLocaleString();
    chartData.push(item);
  });

  return (
    <>
      <div>
        <h1 className="text-base">Select Date Range for Chart!</h1>
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          placeholderText={"Select Date Range"}
          className={"dateTime"}
          onChange={(update) => {
            let isNotNull = (value) => value != null;
            let filteredArray = update.filter(isNotNull);
            if(filteredArray.length === 2){
              setFromDate(filteredArray[0].toDateString())
              setToDate(filteredArray[1].toDateString())
            }
            setDateRange(update);
          }}
          isClearable={true}
        />
      </div>
      <div className="card">
        <Chart
          chartType="LineChart"
          width="50rem"
          height="500px"
          data={chartData}
          options={options}
        />
      </div>
    </>
  );
}

export default App;
