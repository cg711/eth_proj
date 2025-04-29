(async () => {
    
    // change contractAddress per deployment
    const contractAddress = '0x83ea36A764F46963A2BB024C43889A82A926a041';
    console.log('start exec')
    
    const artifactsPath = `PROJECT-3_ETHEREUM/artifacts/TravelInsurance.json` // Change this for different path
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
    const accounts = await web3.eth.getAccounts()
    const account1 = accounts[0];
    const account2 = accounts[1];
    const providerAccount = accounts[accounts.length - 2];

    lines = await remix.call('fileManager', 'getFile', 'PROJECT-3_ETHEREUM/weather.txt');
    let table = [];
    lines.split('\n').forEach((line) => {
        let row = line.trim().split(/\s+/); //split by whitespace
        table.push(row);
    });    

    // const mapFlightToWeather = (date, destination) => {
    //     table.forEach((row) => {
    //         if(date === row[0] && destination === row[1]) return row[2];
    //     });
    //     return "None";
    // }

    // create contract per deployed address
    let contract = new web3.eth.Contract(metadata.abi, contractAddress)
    // check provider policies
    console.log("Check provider purchased policies (should appear as none)");
    await contract.methods.viewAllPolicies().call({from: providerAccount}, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    }); 
    // View policies from account 1
    console.log("View avaliable policies from account 1");
        await contract.methods.viewAvaliablePolicy().call({from: account1}, (err, res) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(res);
            }
        });

        console.log("Purchase policy from account 1");
        // Purchase policy from account 1, Hail Weather
        await contract.methods.purchasePolicy("Account 1", 123123, "2023-04-15", "Denver", "Minneapolis").send({from: account1}, (err, res) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(res);
            }
        });

        // Purchase policy from account 2, Normal Weather
        // 2023-04-15 Austin Normal
        console.log("Purchase policy from account 2");
        await contract.methods.purchasePolicy("Account 2", 23423423, "2023-04-15", "Austin", "Minneapolis").send({from: account2}, (err, res) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(res);
            }
        }); 
        // Check account 1 purchased policy and balance
        console.log("Check account 1 purchased policy and balance");
        await contract.methods.viewPurchasedPolicy().call({from: account1}, (err, res) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(res);
            }
        });
        await contract.methods.viewBalance().call({from: account1}, (err, res) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(res);
            }
        });
        // Check account 2 purchased policy and balance
        console.log("Check account 2 purchased policy and balance");
        await contract.methods.viewPurchasedPolicy().call({from: account2}, (err, res) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(res);
            }
        });
        await contract.methods.viewBalance().call({from: account2}, (err, res) => {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log(res);
            }
        });
        // check provider policies
        console.log("Check provider purchased policies");
        await contract.methods.viewAllPolicies().call({from: providerAccount}, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        });        
        // Verify claims
        console.log("Provider verifies claim from account 1");
        // let weather = mapFlightToWeather("2023-04-15", "Denver");
        // console.log(weather);
        await contract.methods.verify("2023-04-15", "Denver", "Hail").call({from: providerAccount}, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        });  
        // check provider policies
        console.log("Check provider purchased policies");
        await contract.methods.viewAllPolicies().call({from: providerAccount}, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        });     
})()

