(async () => {
    
    // change contractAddress per deployment
    const contractAddress = '0x7ED998d161144352a56b52cA3c55D555Bfc70E2F'
    console.log('start exec')
    
    const artifactsPath = `PROJECT-3_ETHEREUM/artifacts/TravelInsurance.json` // Change this for different path
    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
    const accounts = await web3.eth.getAccounts()
    const account1 = accounts[0];
    const account2 = accounts[1];
    const providerAccount = accounts[accounts.length - 2];

    
    // create contract per deployed address
    let contract = new web3.eth.Contract(metadata.abi, contractAddress)
    
    // contract.methods.retrieve().call(function (err, result) {
    //     if (err){
    //         console.log("An error occured", err)
    //         return
    //     } else {
    //         console.log("The result of first query is: ", result)
    //         console.log('first qurey finished')
    //     }
    // })
    
    // //Asynchronous version
    // // contract.methods.store(50).send({from: accounts[0]}, function (err, res) {
    // //     if (err) {
    // //           console.log("An error occured", err)
    // //           return
    // //     }
    // //     console.log("Hash of the transaction: " + res)
    // // })
    
    // let result = await contract.methods.store(30).send({from: accounts[3]})
    // console.log("Store result is: ", result)
    
    // contract.methods.retrieve().call(function (err, result) {
    //     if (err){
    //         console.log("An error occured", err)
    //         return
    //     } else {
    //         console.log("The result of second query is: ", result)
    //         console.log('second query finished')
    //     }
    // })

    // View policies from account 1
    contract.methods.viewAvaliablePolicy().call({from: account1}, (err, res) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log(res);
        }
    });
    // Purchase policy from account 1
    contract.methods.purchasePolicy("Account 1", 123123, "2023-04-15", "Denver", "Minneapolis").call({from: account1}, (err, res) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log(res);
        }
    });
    // View purchased policy from account 1
    contract.methods.viewPurchasedPolicy().call({from: account1}, (err, res) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log(res);
        }
    });
    
    console.log('exec finished')
    
})()
