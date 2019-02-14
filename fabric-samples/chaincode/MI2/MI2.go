package main

import(	
	"strconv"
	"encoding/json"
	"fmt"
	"reflect"
	"time"
	
	"github.com/hyperledger/fabric/core/chaincode/shim"
    sc "github.com/hyperledger/fabric/protos/peer"
)

type MedicalInsurance struct
{
}
type Insurance struct
{
	Insurance_Company string `json:"InsuranceCompany"`
	Agent string `json:"Agent"`
	Agent_Code string `json:"AgentCode"`
	Agent_Contact string `json:"AgentContact"`
	Office string `json:"Office"`
	Client_Id string `json:"Client_Id"`
	Proposal_No int `json:"Proposal_No"`
	Holder_Name string `json:"Holder_Name"`
	Holder_Address string `json:"HolderAddress"`
	Policy_Number int `json:"Policy_Number"`
	Policy_Type string `json:"Policy_Type"`
	Policy_Period int `json:"Policy_Period"`
	First_Policy_Date int64 `json:"First_Policy_Date"`
	Next_Policy_Date int64 `json:"Next_Policy_Date"`
	Insured_Id int `json:"Insured_Id"`
	Insured_Name string `json:"Insured_Name"`
	Insured_Age int `json:"Insured_Age"`
	Insured_Relationship string `json:"Insured_Relationship"`
	Total_Insured int `json:"Total_Insured"`
	Cumulative_Bonus int `json:"Cumulative_Bonus"`
	Net_Premium int `json:"Net_Premium"`
	Total int `json:"Total"`
	Balance int `json:"Balance"`
	Monthly_Invest int `json:"Monthly_Invest"`
	Status int `json:"status"`
}
type Agent struct
{
	Name string `json:"Name"`
	Contact string `json:"Contact"`
	Total_Payment int `json:"Total_Payment"`
}
type User struct
{
	Name string `json:"Name"`
	Age int `json:"Age"`
	Insured_Relationship string `json:"Insured_Relationship"`
	Address string `json:"Address"`
}
type Nominee struct
{
	Insured string `json:"Insured"`
	Nominee_Name string `json:"Nominee_Name"`
	Relationship string `json:"Relationship"`
}
type Receipt struct
{
	Sl_No int `json:"Sl_No"`
	Date int64 `json:"Date"`
	Policy_No int `json:"Policy_No"`
	Total_Premium int `json:"Total_Premium"`
	Total_Amount_Paid int `json:"Total_Amount_Paid"`
	Balance int `json:"Balance"`
}
type Claim struct{
	Insured_Id string `json:"Insured_id"`
	Policy_No string  `json:"Policy_No"`
	ClaimFor string `json:"Claim_For"`
	Verified int `json:"verified"`
	Status int `json:"Status"`
}
/*
*This Init function is called at the time of instantiation of the chaincode
*This function sets Agents, Customers, Policies, Receipts and Claims to be zero initially
*/
func(t *MedicalInsurance) Init(stub shim.ChaincodeStubInterface) sc.Response {
	err:=stub.PutState("Licence",[]byte(strconv.Itoa(0)))
	if err!=nil{
		return shim.Error(err.Error())
	}
	fmt.Printf("Initialized1")
	err=stub.PutState("Customer",[]byte(strconv.Itoa(0)))
	if err!=nil{
		return shim.Error(err.Error())
	}
	fmt.Printf("\nInitialized2")
	err=stub.PutState("Proposal",[]byte(strconv.Itoa(0)))
	if err!=nil{
		return shim.Error(err.Error())
	}
	fmt.Printf("\nInitialized3")
	err=stub.PutState("Receipts",[]byte(strconv.Itoa(0)))
	if err!= nil{
		return shim.Error(err.Error())
	}
	err=stub.PutState("Claims",[]byte(strconv.Itoa(0)))
	if err!= nil{
		return shim.Error(err.Error())
	}
	fmt.Printf("\nInitialized4")
	return shim.Success(nil)
}
/*
* Invoke function is executed for each and every invocations after the instantiation of the chaincode
* Parameters: [operation,args]
* operation is the function name to be performed
* args are required for the functions execution
*/
func (t *MedicalInsurance) Invoke(stub shim.ChaincodeStubInterface) sc.Response {
	function, args := stub.GetFunctionAndParameters()
	/*This is used to Register Agents*/
	if function=="RegisterAgent"{
		return t.RegisterAgent(stub,args)
	}
	/*This is used to Register Customers*/
	if function=="RegisterCustomer"{
		return t.RegisterCustomer(stub,args)
	}
	/*This is used to make a new policy*/
	if function=="NewPolicy"{
		return t.NewPolicy(stub,args)
	}
	/*This is used to get Total participants such as Agents/Users/Policies/Receipts*/
	if function=="TotalStakers"{
		return t.TotalStakers(stub,args)
	}
	/*This is used to make payments for the policies*/
	if function=="MakePayment"{
		return t.MakePayment(stub,args)
	}
	/*This is used to get the details of participants such as Agent/user/Policy/Receipt/Claim*/
	if function=="GetDetails"{
		return t.GetDetails(stub,args)
	}
	/*This is used to make a claim request*/
	if function=="RequestClaim"{
		return t.RequestClaim(stub,args)
	}
	/*This is used to Verify the claim request for the policy*/
	if function=="VerifyClaim"{	
		return t.VerifyClaim(stub,args)
	}
	/*This is used to pay the verified claims and close the policies*/
	if function=="PayforClaim"{
		return t.PayforClaim(stub,args)
	}
	return shim.Error("check function name")
}

/*
* Request Claim function is used to make a new Claim request
*@params:Customer Id, Policy Id, Claim reason
*/
func (t *MedicalInsurance) RequestClaim(stub shim.ChaincodeStubInterface, args []string) sc.Response{
	if len(args)!= 3{
		return shim.Error("arguments length mismatch")
	}

	//to get total claims
	claim,err:= stub.GetState("Claims")
	if err != nil{
		return shim.Error(err.Error())
	}
	var newClaim int
	newClaim,err=strconv.Atoi(string(claim))
	if err !=nil{
		return shim.Error(err.Error())
	}
	var claimFor string
	claimFor=args[2]

	//making new claim data
	data:=Claim{Insured_Id:args[0],Policy_No:args[1],ClaimFor:claimFor,Verified:0,Status:1}
	var dataBytes []byte
	dataBytes,err=json.Marshal(data)
	if err !=nil{
		return shim.Error(err.Error())
	}
	
	//increamenting the total claims
	newClaim=newClaim+1
	newClaimstr:=strconv.Itoa(newClaim)

	//Updating claim data to the ledger
	err=stub.PutState("Claim"+newClaimstr,dataBytes)
	if err != nil{
		return shim.Error(err.Error())
	}
	//updating total claims to the ledger
	err=stub.PutState("Claims",[]byte(newClaimstr))
	if err !=nil{
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}

/*
*This function is called to verify the claims
@params: Claim Id
*/
func (t *MedicalInsurance) VerifyClaim(stub shim.ChaincodeStubInterface,args []string) sc.Response{
	//checking the args length
	if len(args) != 1{
		return shim.Error("arguments length mismatch")
	}
	//getting the claim data using the claim id
	claim,err:=stub.GetState("Claim"+args[0])
	if claim==nil{
		return shim.Error("no claim found")
	}

	//parsing claim data into struct
	claimData:=Claim{}
	json.Unmarshal(claim,&claimData)
	var insurance []byte
	//getting the policy data using the policy id from claim data
	insurance,err=stub.GetState("Policy"+claimData.Insured_Id)
	insuranceData:=Insurance{};
	json.Unmarshal(insurance,&insuranceData)

	firstPolicy:=int64(insuranceData.First_Policy_Date)
	policyPeriod:=int64(insuranceData.Policy_Period)
	
	//checking the policy paid details and the period limit
	//Calculates total balances
	var dueTime int64= policyPeriod*200
	dueTime+=firstPolicy
		if (dueTime)<= (time.Now().Unix()){
			claimData.Verified=1;
			claimData.Status=-1;
			cb:=(insuranceData.Total_Insured*(insuranceData.Total*5))/100
			insuranceData.Cumulative_Bonus=cb;
			insuranceData.Total=0;
			insuranceData.Net_Premium=insuranceData.Total_Insured+insuranceData.Cumulative_Bonus;
		}
	
	//marshals claim data
	dataBytes,err:=json.Marshal(claimData)
	if err!=nil{
		return shim.Error(err.Error())
	}
	//updating claim data to the ledger
	err=stub.PutState("Claim"+args[0],dataBytes)
	if err!= nil{
		return shim.Error(err.Error())
	}
	//updating insurance data to the ledger
	dataBytes,err=json.Marshal(insuranceData)
	if err!= nil{
		return shim.Error(err.Error())
	}
	//updating policy data to the ledger
	err =stub.PutState("Policy"+claimData.Insured_Id,dataBytes)
	if err != nil{
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}
/*
This function is usede to make payments for the verified claims
@params: Claim Id
*/
func (t *MedicalInsurance) PayforClaim(stub shim.ChaincodeStubInterface,args []string) sc.Response{
	//checking for the arguments
	if len(args) !=1 {
		return shim.Error("arguments length mismatch")
	}
	//getting claim data using claim id
	claim,err:=stub.GetState("Claim"+args[0])
	if claim==nil{
		return shim.Error("no claim found")
	}

	//unmarshaling claim data
	claimData:=Claim{}
	json.Unmarshal(claim,&claimData)
	fmt.Println(claimData)
	claimData.Verified=-1; 
	dataBytes,err:=json.Marshal(claimData)

	//getting policy data
	insurance,errIns:=stub.GetState("Policy"+claimData.Policy_No)
	if insurance==nil{
		return shim.Error("No policy data found")
	}
	if errIns!=nil{
		return shim.Error(err.Error())
	}

	//unmarshaling insurance data and modifying
	insuranceData:=Insurance{}
	json.Unmarshal(insurance,&insuranceData)
	insuranceData.Status=-1;

	//updating claim data to the ledger
	err=stub.PutState("Claim"+args[0],dataBytes)
	if err!= nil{
		return shim.Error(err.Error())
	}

	dataBytes,err=json.Marshal(insuranceData)
	
	//updating policy data to the ledger
	err=stub.PutState("Policy"+claimData.Policy_No,dataBytes)
	if err!=nil{
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}

/*
*This function is used to create new agent
*@params: Name, Contact
*/
func (t *MedicalInsurance) RegisterAgent(stub shim.ChaincodeStubInterface,args []string) sc.Response{ 
	//checking for argument length
	if len(args)!=2{
		return shim.Error("arguments length mismatch")
	}

	//getting total agent counts
	lisence,err := stub.GetState("Licence")
	if err != nil{
		return shim.Error(err.Error())
	}

	//converting agent count from string to integer
	newLisence,err:=strconv.Atoi(string(lisence))
	if err!=nil{
		return shim.Error(err.Error())
	}

	//increamenting number of agents
	newLisence+=1

	//updating new agents count
	err =stub.PutState("Licence",[]byte(strconv.Itoa(newLisence)))

	if err != nil{
		shim.Error(err.Error())
	}

	//marshaling agent data
	var data=Agent{Name:args[0],Contact:args[1]}
	dataBytes,err:=json.Marshal(data)

	//updating agent data to the ledger
	err=stub.PutState("Agent"+strconv.Itoa(newLisence),dataBytes)

	if err != nil{
		shim.Error(err.Error())
	}
	fmt.Printf("\nRegistered")
	return shim.Success(nil)
}
/*
*This function is used to create new customer
*@params:Name, age, relationship, address
*/
func (t *MedicalInsurance) RegisterCustomer(stub shim.ChaincodeStubInterface,args []string) sc.Response{
	//checking arguments length
	if len(args)!=4{
		return shim.Error("arguments length mismatch")
	}
	var age int

	//getting total customers
	lisence,err := stub.GetState("Customer")
	if err != nil{
		return shim.Error(err.Error())
	}

	//converting total customers from string type to int
	newLisence,err:=strconv.Atoi(string(lisence))
	if err!=nil{
		return shim.Error(err.Error())
	}

	//increasing number of customers
	newLisence+=1

	//converting number of customers from int type to string
	err =stub.PutState("Customer",[]byte(strconv.Itoa(newLisence)))

	if err != nil{
		shim.Error(err.Error())
	}

	age,err=strconv.Atoi(args[1])
	if err!=nil{
		shim.Error(err.Error())
	}

	//creating customer data object
	var data=User{Name:args[0],Age:age,Insured_Relationship:args[2],Address:args[3]}
	dataBytes,err:=json.Marshal(data)
	
	//updating customer data to the ledger
	err=stub.PutState("Customer"+strconv.Itoa(newLisence),dataBytes)

	if err != nil{
		shim.Error(err.Error())
	}
	fmt.Printf("\nRegistered")
	return shim.Success(nil)
}

/*
*This function is used to create a new policy
@params:Company, AgentId, Office, policyType, period, custId, total amount
*/
func (t *MedicalInsurance) NewPolicy(stub shim.ChaincodeStubInterface, args []string) sc.Response{
	var Adata []byte
	//checking arguments length
	if len(args)!=7{
		return shim.Error("invalid parameters")
	}

	var Cdata []byte
	var err error

	//getting agent data using agent id
	Adata,err = stub.GetState("Agent"+args[1])
	if Adata==nil{
		return shim.Error("no Agent data found")
	}

	agent:=Agent{}
	json.Unmarshal(Adata,&agent)

	//creating new policy details
	var cId int
	cId,err=strconv.Atoi(args[5])
	id:=strconv.Itoa(cId)

	//getting customer data using customer id
	Cdata,err=stub.GetState("Customer"+id)
	if Cdata ==nil{
		return shim.Error("no Agent data found")
	}
	client:=User{}
	json.Unmarshal(Cdata,&client)

	var period int

	//getting total policies
	proposal,err:=stub.GetState("Proposal")
	newProposal,err:=strconv.Atoi(string(proposal))

	//increamenting policy count
	newProposal+=1
	if err != nil{
		return shim.Error(err.Error())
	}

	period,err=strconv.Atoi(args[4])
	Total_amount:=0
	/*date,er:= strconv.Atoi(args[7])	
	if er != nil{
		return shim.Error(er.Error())
	}*///Agent:agent.Name,Agent_Contact:agent.Contact,
	var mI int
	ta,err1:=strconv.Atoi(string(args[6]))
	if err!=nil{
		return shim.Error(err1.Error())
	}
	mI=ta/period
	mI=ta-(((mI)*10)/100);
	bal:=mI;
	mI=mI/period;
	var np int64=time.Now().Unix()+200;
	var data=Insurance{Insurance_Company:args[0], Agent:agent.Name,Agent_Contact:agent.Contact,Agent_Code:args[1],Office:args[2],
	Proposal_No:newProposal,Policy_Number:newProposal,Policy_Type:args[3],Policy_Period:period, Client_Id: id, Holder_Name:client.Name,
	First_Policy_Date:(time.Now().Unix()),Next_Policy_Date:np, Insured_Id :cId,Total_Insured:Total_amount,Holder_Address:client.Address, Insured_Name:client.Name, Insured_Age: client.Age,
	Insured_Relationship:client.Insured_Relationship,Total:0,Balance:bal, Monthly_Invest:mI }
	// insurance.Agent=agent.Name;
	// insurance.Agent_Contact=agent.Agent_Contact
	dataBytes,err:=json.Marshal(data)

	//updating policy data to the ledger
	err=stub.PutState("Policy"+strconv.Itoa(newProposal),dataBytes)

	if err!=nil{
		shim.Error(err.Error())
	}

	//updating total policy count to the ledger
	err =stub.PutState("Proposal",[]byte(strconv.Itoa(newProposal)))

	if err != nil{
		shim.Error(err.Error())
	}
	fmt.Printf("\nRegistered")
	return shim.Success(nil)
}

/*
*This function is used to make the payment process for the policies
@params:policyId, agentId, next policy
*/
func (t *MedicalInsurance) MakePayment(stub shim.ChaincodeStubInterface, args []string) sc.Response{
	// var firstPolicy int64
	var nextPolicy int64
	//checking the argument length
	if len(args)!=3{
		return shim.Error("invalid parameters")
	}
	var Idata []byte
	var Adata []byte
	// nextPolicy=args[2]
	var err error

	//getting the policy details from policy id
	Idata,err=stub.GetState("Policy"+args[0])
	if Idata==nil{
		return shim.Error("no policy found")
	}
	if err!=nil{
		return shim.Error(err.Error())
	}

	//getting agent details from agent id
	Adata,err = stub.GetState("Agent"+args[1])
	if Adata==nil{
		return shim.Error("no Agent data found")
	}
	insurance:=Insurance{}
	agent:=Agent{}

	json.Unmarshal(Idata,&insurance)
	json.Unmarshal(Adata,&agent)

	//modifying the payment details
	np,_:=strconv.Atoi(string(args[2]))
	nextPolicy=int64(np)

	//insurance.Total_Insured=insurance.Total_Insured+insurance.Monthly_Invest
	if insurance.Status==-1{
		return shim.Error("Could not make payment for claim Policy")
	}
	insurance.Total+=1;
	insurance.Balance=insurance.Balance-(insurance.Monthly_Invest)
	// insurance.nextPolicy=nextPolicy;
	insurance.Total_Insured+=insurance.Monthly_Invest;
	insurance.Next_Policy_Date=nextPolicy;
	agent.Total_Payment+=1
	fmt.Println(nextPolicy)
	fmt.Println(insurance.Next_Policy_Date)
	fmt.Println(reflect.TypeOf(insurance.Next_Policy_Date))
	fmt.Println("abcde")

	// fmt.Println(insurance.nextPolicy)

	var newIdata []byte
	//marshaling data objects
	newIdata,err= json.Marshal(insurance)
	if err != nil{
		return shim.Error(err.Error())
	}
	var newAdata []byte
	newAdata,err=json.Marshal(agent)
	if err!= nil{
		return shim.Error(err.Error())
	}

	//updating policy data to the ledger
	err=stub.PutState("Policy"+args[0],newIdata)
	if err!= nil{
		return shim.Error(err.Error())
	}

	//updating agent data to the ledger
	err=stub.PutState("Agent"+args[1],newAdata)
	if err != nil{
		return shim.Error(err.Error())
	}

	//making receipt
	var receipt []byte
	//getting receipt count
	receipt,err=stub.GetState("Receipts")
	var newReceipt int
	newReceipt,err=strconv.Atoi(string(receipt))
	newReceipt+=1


	var data=Receipt{Sl_No:insurance.Total,Date:time.Now().Unix(),Policy_No:insurance.Policy_Number,Total_Premium:insurance.Net_Premium,
	Total_Amount_Paid:insurance.Total_Insured,Balance:insurance.Balance}

	var dataBytes []byte
	dataBytes,err=json.Marshal(data)

	//updating receipt data
	err=stub.PutState("Receipt"+strconv.Itoa(newReceipt),dataBytes)

	//updating receipt count
	err=stub.PutState("Receipts",[]byte(strconv.Itoa(newReceipt)))

	return shim.Success([]byte(strconv.Itoa(newReceipt)))
}

/*
*This function is used to get total number of participants
*@params:Agents/Users/Policies/Receipts/Claims
*/
func (t *MedicalInsurance) TotalStakers(stub shim.ChaincodeStubInterface,args []string) sc.Response{
	var err error
	var data []byte
	//checking argument length
	if len(args) != 1{
		return shim.Error("arguments length mismatch")
	}
	if args[0]=="Agents"{
		//getting total agents
		data,err=stub.GetState("Licence")
	}
	if args[0]=="Users"{
		//getting total customers
		data,err=stub.GetState("Customer")
	}
	if args[0]=="Policies"{
		//getting total policies
		data,err=stub.GetState("Proposal")
	}
	if args[0]=="Receipts" {
		//getting total receipts
		data,err=stub.GetState("Receipts")
	}
	if args[0]=="Claims"{
		//getting total claims
		data,err=stub.GetState("Claims")
	}
	if err != nil{
		//returing error if data is null
		return shim.Error(err.Error())
	}
	return shim.Success(data)
}
/*
*This function is used to get details of Agent/User/Customer/Policy/Receipt/Claim
@params:Agent/User/Policy/Receipt/Claim, id
*/
func (t *MedicalInsurance) GetDetails(stub shim.ChaincodeStubInterface,args []string) sc.Response{
	var err error
	var data []byte

	//checking argument length
	if len(args) != 2{
		return shim.Error("arguments length mismatch")
	}

	if args[0]=="Agent"{
		//getting agent details using agent id
		data,err=stub.GetState("Agent"+args[1])
	}

	if args[0]=="User"{
		//getting customer details using customer id
		data,err=stub.GetState("Customer"+args[1])
	}

	if args[0]=="Policy"{
		//getting policy details using policy id
		data,err=stub.GetState("Policy"+args[1])
	}

	if args[0]=="Receipt"{
		//getting receipt details using receipt number
		data,err=stub.GetState("Receipt"+args[1])
	}

	if args[0]=="Claim"{
		//getting claim details using claim id
		data,err=stub.GetState("Claim"+args[1])
	}

	if err != nil{
		//returning error if data is null
		return shim.Error(err.Error())
	}

	return shim.Success(data)
}
func main(){
	err:=shim.Start(new(MedicalInsurance))
	if err!=nil{
		fmt.Printf("\nError in creating: %s",err)
	}
}