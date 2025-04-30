(async () => {
  // change contractAddress per deployment
  const contractAddress = "0x59AFA72e88827d6157A95f9F6243C27C9Fc7CDFa";
  console.log("start exec");

  const artifactsPath = `PROJECT-3_ETHEREUM/PROJECT-3_ETHEREUM/artifacts/TravelInsurance.json`; // Change this for different path
  const metadata = JSON.parse(
    await remix.call("fileManager", "getFile", artifactsPath)
  );
  const accounts = await web3.eth.getAccounts();
  const account1 = accounts[0];
  const account2 = accounts[1];
  const providerAccount = accounts[accounts.length - 2];

  lines = await remix.call(
    "fileManager",
    "getFile",
    "PROJECT-3_ETHEREUM/PROJECT-3_ETHEREUM/weather.txt"
  );
  let table = [];
  lines.split("\n").forEach((line) => {
    let row = line.trim().split(/\s+/); //split by whitespace
    table.push(row);
  });

  const mapFlightToWeather = (date, destination) => {
    let weather = "None";
    table.forEach((row) => {
      if (date == row[0] && destination == row[1]) weather = row[2];
    });
    return weather;
  };

  // create contract per deployed address
  let contract = new web3.eth.Contract(metadata.abi, contractAddress);
  // check provider policies
  console.log("Check provider purchased policies (should appear as none)");
  let r = await contract.methods
    .viewAllPolicies()
    .call({ from: providerAccount }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  // View policies from account 1
  console.log("View avaliable policies from account 1");
  r = await contract.methods
    .viewAvaliablePolicy()
    .call({ from: account1 }, (err, res) => {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(res);
      }
    });

  console.log("Purchase policy from account 1");
  // Purchase policy from account 1, Hail Weather
  r = await contract.methods
    .purchasePolicy("Account 1", 123, "2023-04-15", "Denver", "Minneapolis")
    .send(
      { from: account1, value: web3.utils.toWei("0.01", "ether") },
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log(res);
        }
      }
    );

  console.log(`Gas used: ${r.gasUsed}`);

  // Purchase policy from account 2, Normal Weather
  // 2023-04-15 Austin Normal
  console.log("Purchase policy from account 2");
  r = await contract.methods
    .purchasePolicy(
      "Account 2",
      23423423,
      "2023-04-15",
      "Austin",
      "Minneapolis"
    )
    .send(
      { from: account2, value: web3.utils.toWei("0.01", "ether") },
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log(res);
        }
      }
    );
  console.log(`Gas used: ${r.gasUsed}`);

  // Check account 1 purchased policy and balance
  console.log("Check account 1 purchased policy and balance");
  r = await contract.methods
    .viewPurchasedPolicy()
    .call({ from: account1 }, (err, res) => {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(res);
      }
    });

  r = await contract.methods
    .viewBalance()
    .call({ from: account1 }, (err, res) => {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(res);
      }
    });

  // Check account 2 purchased policy and balance
  console.log("Check account 2 purchased policy and balance");
  r = await contract.methods
    .viewPurchasedPolicy()
    .call({ from: account2 }, (err, res) => {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(res);
      }
    });

  r = await contract.methods
    .viewBalance()
    .call({ from: account2 }, (err, res) => {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(res);
      }
    });

  // check provider policies
  console.log("Check provider purchased policies");
  r = await contract.methods
    .viewAllPolicies()
    .call({ from: providerAccount }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });

  // Verify claims
  console.log("Provider verifies claim from account 1");
  let weather = mapFlightToWeather("2023-04-15", "Denver");
  // console.log(weather);
  r = await contract.methods
    .verify("2023-04-15", "Denver", weather)
    .call({ from: providerAccount }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  r = await contract.methods
    .verify("2023-04-15", "Denver", weather)
    .send({ from: providerAccount }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  console.log(`Gas used: ${r.gasUsed}`);

  console.log("Provider verifies claim from account 2");
  weather = mapFlightToWeather("2023-04-15", "Austin");

  // let weather = mapFlightToWeather("2023-04-15", "Denver");
  r = await contract.methods
    .verify("2023-04-15", "Austin", weather)
    .call({ from: providerAccount }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  r = await contract.methods
    .verify("2023-04-15", "Austin", weather)
    .send({ from: providerAccount }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  console.log(`Gas used: ${r.gasUsed}`);

  // check provider policies
  console.log("Check provider purchased policies");
  r = await contract.methods
    .viewAllPolicies()
    .call({ from: providerAccount }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });

  // Check account 1 purchased policy and balance
  console.log("Check account 1 purchased policy and balance");
  r = await contract.methods
    .viewPurchasedPolicy()
    .call({ from: account1 }, (err, res) => {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(res);
      }
    });

  r = await contract.methods
    .viewBalance()
    .call({ from: account1 }, (err, res) => {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(res);
      }
    });
})();
