import { Component  } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import $ from '../jquery.min.js';
import { empty } from 'rxjs';
import { CompileShallowModuleMetadata } from '@angular/compiler';
import { promise } from 'protractor';
import { resolve } from 'dns';
import { reject } from 'q';
// import { type } from 'os';
// import { ConsoleReporter } from 'jasmine';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  element:number;
  title = 'MedicalInsurance';
  state=" "
  api:string='http://10.10.4.133:3000'
  content:number; 
  date:string;
  company_name: string = '';
  policy_agent_id:string;
  agent_id:String;
  office_branch:string;
  // policy_number:string;
  period:string;
  client_id:string;
  policy_id:string;
  agent_name:string;
  agent_contact:string;
  customer_name:string;
  customer_age:string;
  relationship:string;
  address:string;
  claim_insured_id:string;
  claim_policy_number:string;
  verify_claim_id:string;
  pay_claim_id:string;
  policy_type:any;
  policy_period:any;
  claim_for:any;
  agent_detail_id:any;
  got_agent_name:any;
  got_agent_contact:any;
  got_agent_payment:any;
  inner_content:number;
  policy_detail_id:any;
  claim_detail_id:any;
  total_count:any;
  show_agent:boolean;
  show_user:boolean;
  user_detail_id:string;
  contact :string
  name : string
  Total_Payment:string
  data:any;
  user_name:any;
  user_age:any;
  user_address:any;
  user_relationship:any;
  policy_agent_code:any;
  policy_balance:any;
  policy_client_id:any;
  policy_cummulative_bonus:any;
  policy_first_date:any;
  policy_holder_name:any;
  policy_holder_address:any;
  policy_policy_number:any;
  policy_policy_period:any
  policy_policy_type:any
  receipt_id:any;
  receipt_balance:any;
  receipt_date:any;
  receipt_policy_no:any;
  receipt_sl_no:any;
  receipt_total_amount_paid:any;
  receipt_total_premium:any;
  Total_Insured:any;
  Next_Policy_Date:any;
  Monthly_Invest: any;
  total_amount:any;
  claim_verified:any;
  agentList:any = [];
  custList:any=[];
  policyList:any=[];
  claimList:any=[];
  receiptList:any=[];
  // public myadmin:Boolean=false;
    constructor(private http:HttpClient)
    {
      this.setAgents();
      this.setCustomers();
      this.setPolicies();
      this.setClaimList();
      this.setReceiptList();
      console.log(this.agentList)
      this.date=Date().substring(0,25);
      var data:object={
      name:this.customer_name,
      age:this.customer_age,
      realtionship:this.relationship,
      address:this.address
      }
      this.data = data;
      // this.getdetails('Receipt',1)
      // this.getdetails('Claim',1)
      // this.getStakers('Users')
      // this.getStakers('Policies')
      // this.getStakers('Receipts')
      // this.getStakers('Claims')
    }
  operation(x){
    //  var x=event.target.value;   
    this.element=x;
    if(x==8)
    this.getStakers('Agents')
    if(x==9)
    this.getStakers('Users')
    if(x==10)
    this.getStakers('Policies')
    if(x==11)
    this.getStakers('Receipts')
    if(x==12)
    this.getStakers('Claims')
    this.heading(x)
  }
  getdata(evt){
    console.log(evt.target.value)
  }
  // admin(){
  //   this.myadmin =true;
  //   // alert("hai");
  // }
  checkusers(){
    let medi=this;
    var _dat:object={
      name:medi.customer_name,
      age:medi.customer_age,
      relationship:medi.relationship,
      address:medi.address
    }
    console.log(_dat)
    console.log("Name, age, relationship, address")
    $.post(medi.api+'/checkuser',_dat,function (data) {  
      if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
      {
        alert('Please try again')
        medi.destroy();
      }
      else{
        alert('success');
        medi.destroy()
      }
  })
  }

Agent_registeration(){
  let medi=this;
  var dat:object={
    name:medi.agent_name,
    contact:medi.agent_contact
  }
  console.log("abc")
  console.log(dat)
  console.log("Name, Contact")
  $.post(medi.api+'/registerAgent',dat,function (data) {  
    if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
    {
      alert('Please try again')
      medi.destroy();
    }
    else{
      alert('success')
      medi.destroy()
    }
})
}

customer_registeration(){
  let medi=this;
  var _dat:object={
    name:medi.customer_name,
    age:medi.customer_age,
    relationship:medi.relationship,
    address:medi.address
  }
  console.log(_dat)
  console.log("Name, age, relationship, address")
  $.post(medi.api+'/registerCustomer',_dat,function (data) {  
    if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
    {
      alert('Please try again')
      medi.destroy();
    }
    else{
      alert('success');
      medi.destroy()
    }
})
}

set_policy_type(type){
  this.policy_type=type;
}

set_policy_period(period){
  this.policy_period=period;
  console.log("a")
}
set_total_amount(amt){
  this.total_amount=amt;
  console.log("b")
}


new_policy(){  
  let medi=this;
  var policy_data:object={
    name:medi.company_name,
    Agent:medi.policy_agent_id,
    office:medi.office_branch,
    // policyNo:medi.policy_number,
    policyType:medi.policy_type,
    policyPeriod:medi.policy_period,
    clientId:medi.client_id,
    totalAmount:medi.total_amount
  }
  console.log("sriram")
  console.log(this.policy_agent_id)
  console.log(policy_data)
  console.log("abc")
  console.log("Company, AgentId, Office, policyType, period, custId, total amount")
  console.log((this.company_name))
  console.log((this.policy_agent_id))
  console.log((this.office_branch))
  console.log((this.policy_type))
  console.log((this.policy_period))
  console.log((this.client_id))
  $.post(medi.api+'/New',policy_data,function (data) {
  if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
    {
      alert('Please try again')
      medi.destroy();
      (document.getElementById('policy_dropdown') as HTMLInputElement).value='Policy Period';
      (document.getElementById('policytype_dropdown') as HTMLInputElement).value='Policy Type';
    }
    else{
      alert('Success')
      medi.destroy();
      (document.getElementById('policy_dropdown') as HTMLInputElement).value='Policy Period';
      (document.getElementById('policytype_dropdown') as HTMLInputElement).value='Policy Type';

    }
})

}
make_payment(){
  let medi=this;
  this.getPolicyTime("Policy",medi.policy_id).then(res=>{
    if((res.Balance<=0)||res.Total>=res.Policy_Period){
      alert("Policy is filled");
      return;
    }
    var npt=res.Next_Policy_Date;
    var now=(Math.floor(new Date().getTime()/1000.0))
    if(now<npt){
      alert("Could not able to pay now")
      return;
    }
    else{
      var data_:object={
        policy: medi.policy_id,
        agent:medi.agent_id,
        nextPolicy:npt
      }
      console.log(data_)
      $.post(medi.api+'/Paydue',data_,function (data) { 
        if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
        {
          alert('Please try again')
          medi.destroy();
        }
        else{
          alert('Success')
          medi.destroy();
        }
    })
    }
  })
}

request_claim(){
  let medi=this;
  this.getPolicyTime("Policy",medi.claim_policy_number).then(res=>{
    var now=(Math.floor(new Date().getTime()/1000.0))
    // if(now<res.Next_Policy_Date){
    //   alert("Policy can not claim now")
    //   return;
    // }
let medi=this;
  var da:object={
    InsuredId:medi.claim_insured_id,
    PolicyNo:medi.claim_policy_number,
    claimFor:medi.claim_for
  }
  console.log(da)
  console.log("custId, policyId, claimFor")
  $.post(medi.api+'/requestClaim',da,function (data) {  
    if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
    {
      alert('Please try again')
      medi.destroy();
    }
    else{
      alert('Success')
      medi.destroy();
    }
})
  })
}
verify_claim(){
  let medi=this;
  var _da:object={
    claimId:medi.verify_claim_id
  }
  console.log(_da)
  $.post(medi.api+'/verifyClaim',_da,function (data) {  
    console.log(data);
    
    if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
    {
      alert('Please try again')
      medi.destroy();
    }
    else{
      alert('Success')
      medi.destroy();
    }
})
}
payforclaim(){
  let medi=this;
  var da_:object={
    claimId:medi.pay_claim_id
  }
  console.log(da_)
  $.post(medi.api+'/payForClaim',da_,function (data) {  
    console.log(data);
    
    if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
    {
      alert('Please try again')
      medi.destroy();
    }
    else{
      alert('Success')
      medi.destroy();
    }
})
}

getdetails(a,b){
let medi=this;
var dat:object={
  type:a,
  id:b
}


// let header = new HttpHeaders();
// header.append('Content-Type', 'application/json');
// header.append('authentication', `${dat}`);


 
$.post(medi.api+'/getDetails',dat,function (data) {  
  
  medi.contact=data['Contact']
  medi.name = data['Name']
  medi.Total_Payment = data['Total_Payment']
  
  console.log(data);
  
  if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
  {
    alert('Please try again')
    medi.destroy();
  }
  else
  {
    if(medi.element==8){
      console.log('Agent');
      
      medi.got_agent_name=data.Contact;
      medi.got_agent_contact=data.Name;
      medi.got_agent_payment=data.Total_Payment;
    }
    if(medi.element==9){
      console.log('User');
      
      medi.user_name=data.Name;
      medi.user_age=data.Age;
      medi.user_address=data.Address;
      medi.user_relationship=data.Insured_Relationship;
    }
 if(medi.element==10){
      console.log('Policies');
      medi.policy_agent_code=data.AgentCode;
      medi.policy_balance=data.Balance;
      medi.policy_client_id=data.Client_Id;
      medi.policy_cummulative_bonus=data.Cumulative_Bonus;
      medi.policy_holder_name=data.Holder_Name;
      medi.policy_holder_address=data.HolderAddress;
      medi.policy_policy_number=data.Policy_Number;
      medi.policy_policy_period=data.Policy_Period;
      medi.policy_policy_type=data.Policy_Type;
      var nt=new Date(data.First_Policy_Date*1000)
      medi.policy_first_date=nt.toString().slice(0,21)
      medi.Total_Insured =data.Total_Insured
      nt=new Date(data.Next_Policy_Date*1000)
      medi.Next_Policy_Date =nt.toString().slice(0,21)
      medi.Monthly_Invest =data.Monthly_Invest
   
    }
    if(medi.element==11){
      console.log('Receipts');      
      medi.receipt_balance=data.Balance;
      medi.receipt_date=new Date(data.Date*1000)
      medi.receipt_policy_no=data.Policy_No;;
      medi.receipt_sl_no=data.Sl_No;
      medi.receipt_total_amount_paid=data.Total_Amount_Paid;
      medi.receipt_total_premium=data.Total_Premium;
    }
    if(medi.element==12){
      medi.claim_insured_id=data.Insured_id;
      medi.claim_policy_number=data.Policy_No;
      medi.claim_verified=data.verified;
      // console.log('Claim');      
      // medi.receipt_balance=data.Balance;
      // medi.receipt_date=new Date(data.Date*1000)
      // medi.receipt_policy_no=data.Policy_No;;
      // medi.receipt_sl_no=data.Sl_No;
      // medi.receipt_total_amount_paid=data.Total_Amount_Paid;
      // medi.receipt_total_premium=data.Total_Premium;
    }
  }
  return data;

})
}
public async getPolicyTime(type,id):Promise<any>{
  return new Promise((resolve,reject)=>{
    let medi=this;
var dat:object={
  type:type,
  id:id
}
var t;

$.post(medi.api+'/getDetails',dat,function (data) {  
  
  console.log(data);
  
  if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
  {
    alert('Please try again')
    medi.destroy();
  }
  else
  {
    t=data;
  }
  resolve (t);
})
  })as Promise<any>
}

getStakers(a){
let medi=this;
var dat:object={
  staker:a
}
console.log("ad")
console.log(dat)
console.log("Agents/Users/Policies/Receipts/Claims")

$.post(medi.api+'/totalStakers',dat,function (data) {
  console.log('fetched..');

  if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
  {
    alert('Please try again')
    medi.destroy();
  }
  else{
    medi.total_count=data;
    medi.destroy();
  }
})
}
setAgents(){
  let medi=this;
var dat:object={
  staker:"Agents"
}
var cnt;
console.log("ad")


$.post(medi.api+'/totalStakers',dat,function (data) {
  console.log('fetched..');

  if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
  {
    alert('Please try again')
    medi.destroy();
  }
  else{
    medi.total_count=data;
    medi.destroy();
    cnt=data
    medi.agentList.length=0;
    for(var i=1;i<=cnt;i++){
      if (i!=null&&i!=undefined){
    medi.agentList.push(i);
      }
    }
  }
})
}

setCustomers(){
  let medi=this;
var dat:object={
  staker:"Users"
}
var cnt;
console.log("ad")


$.post(medi.api+'/totalStakers',dat,function (data) {
  console.log('fetched..');

  if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
  {
    alert('Please try again')
    medi.destroy();
  }
  else{
    medi.destroy();
    cnt=data
    medi.custList.length=0;
    for(var i=1;i<=cnt;i++){
      if (i!=null&&i!=undefined){
    medi.custList.push(i);
      }
    }
  }
})
}

setPolicies(){
  let medi=this;
var dat:object={
  staker:"Policies"
}
var cnt;
console.log("ad")


$.post(medi.api+'/totalStakers',dat,function (data) {
  console.log('fetched..');

  if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
  {
    alert('Please try again')
    medi.destroy();
  }
  else{
    medi.destroy();
    cnt=data
    medi.policyList.length=0;
    for(var i=1;i<=cnt;i++){
      if (i!=null&&i!=undefined){
    medi.policyList.push(i);
      }
    }
  }
})
}

setClaimList(){
  let medi=this;
var dat:object={
  staker:"Claims"
}
var cnt;
console.log("ad")


$.post(medi.api+'/totalStakers',dat,function (data) {
  console.log('fetched..');
  console.log(data);
  if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
  {
    alert('Please try again')
    medi.destroy();
  }
  else{
    medi.destroy();
    cnt=data
    medi.claimList.length=0;
    for(var i=1;i<=cnt;i++){
      if (i!=null&&i!=undefined){
    medi.claimList.push(i);
    console.log(this.claimList)
      }
    }
  }
})
}

setReceiptList(){
  let medi=this;
var dat:object={
  staker:"Receipts"
}
var cnt;
console.log("ad")


$.post(medi.api+'/totalStakers',dat,function (data) {
  console.log('fetched..');

  if(data=='Failed to invoke successfully :: Error: Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...')
  {
    alert('Please try again')
    medi.destroy();
  }
  else{
    medi.destroy();
    cnt=data
    medi.receiptList.length=0;
    for(var i=1;i<=cnt;i++){
      if (i!=null&&i!=undefined){
    medi.receiptList.push(i);
      }
    }
  }
})
console.log(this.receiptList)
}
ram(event){
  console.log(event.target.value)
}
  heading(i){
    if(i==1)
    {
    this.state='New Policy'
    this.setAgents();
    }
    if(i==2)
    {
    this.state='Payment'
    this.setAgents();
    }
    if(i==3)
    {
    this.state='Agent Registeration'
    }
    if(i==4)
    {
    this.state='customer Registeration'
    }
    if(i==5)
    {
    this.state='Request Claim'
    }
    if(i==6)
    {
    this.state='Verify Claim'
    }
    if(i==7)
    {
    this.state='Pay Claim'
    }
    if(i==8){
    this.state='Agent';
    }
    if(i==9){
      this.setCustomers();
    this.state="User";
    }
    if(i==10){
      this.setPolicies();
      this.state="Policies"
    }
    if(i==11){
      this.setReceiptList();
    this.state="Receipt"
    }
    if(i==12){
      this.setClaimList();
      this.state="Claim"
      }
  }


  destroy(){
      this.company_name='';
      this.policy_agent_id='';
      this.office_branch='';
      // this.policy_number='';
      this.policy_type='';
      this.agent_id='',
      this.policy_period='';
      this.client_id='';
      this.office_branch='';
      // this.policy_number='';
      this.period='';
      this.client_id='';
      this.policy_id='';
      this.agent_name='';
      this.agent_contact='';
      this.customer_name='';
      this.customer_age='';
      this.relationship='';
      this.address='';
      this.claim_insured_id='';
      this.claim_policy_number='';
      this.verify_claim_id='';
      this.pay_claim_id='';
      this.claim_for='';
      this.agent_detail_id='';
      this.got_agent_contact='';
      this.got_agent_name='';
      this.got_agent_payment=''
      this.user_detail_id='';
      this.user_name='';
      this.user_age='';
      this.user_address='';
      this.user_relationship='';
      this.policy_detail_id='';
      this.policy_agent_code='';
      this.policy_balance='';
      this.policy_client_id='';
      this.policy_cummulative_bonus='';
      this.policy_first_date='';
      this.policy_holder_name='';
      this.policy_holder_address='';
      this.policy_policy_number='';
      this.policy_policy_period='';
      this.policy_policy_type='';
      this.receipt_id='';
      this.receipt_balance='';
      this.receipt_date='';
      this.receipt_policy_no='';
      this.receipt_sl_no='';
      this.receipt_total_amount_paid='';
      this.receipt_total_premium='';
      this.total_amount='';
      this.claim_detail_id='';
  }

  
}



/*RegisterAgent : Name, Contact
RegisterCustomer : Name, age, relationship, address
NewPolicy : Company, AgentId, Office, policyType, period, custId, total amount
MakePayment : policyId, agentId, next policy
RequestClaim : custId, policyId, claimFor
VerifyClaim : claimId
PayforClaim : claimId
GetDetails : Agent/User/Policy/Receipt/Claim, id
TotalStakers : Agents/Users/Policies/Receipts/Claims*/

/*
peer chaincode invoke -n mycc -c '{"Args":["RegisterAgent","vrs1","894615445"]}' -C myc
chaincode invoke -n mycc -c '{"Args":["RegisterCustomer","customer1","80","father","car street"]}' -C myc
peer chaincode invoke -n mycc -c '{"Args":["NewPolicy","abc","1","adfasa","sadfsafdas","2","1","200000"]}' -C myc
peer chaincode query -n mycc -c '{"Args":["GetDetails","Policy","1"]}' -C myc
*/