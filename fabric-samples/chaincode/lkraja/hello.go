package main
import (
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)
var a int;
var b int;
var c int;
type SimpleAsset struct {

}

func (t *SimpleAsset) Init(stub shim.ChaincodeStubInterface) peer.Response{
	return shim.Success(nil)

}

func (t *SimpleAsset) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn, args := stub.GetFunctionAndParameters()

if fn == "addition"{
	var p1 int;
	var p2 int;
	var c int;
	var err error
	p1,err = strconv.Atoi(args[0])
	if err!=nil{
		fmt.Println("error in args[0]")
		return shim.Error(err.Error())
	}
	p2,err = strconv.Atoi(args[1])
	if err!=nil{
		fmt.Println("error in args[0]")
		return shim.Error(err.Error())
	}
	c= p1+p2;
	fmt.Println("sum of two values =",c);
}
if fn=="p"{
	p();
}
if fn=="ram"{
	parafunction(args);
}
if fn =="myfun"{
	return myfun();
}

return shim.Success(nil)
}
func myfun() peer.Response{
	return shim.Success([]byte("123_data variables"))
}

func p(){
	fmt.Printf("p function is called")
}

func parafunction(args []string){
	var a string = args[0]
	var b string = args[1];

	var aint int 
	var bint int
	var err error
	aint,err=strconv.Atoi(a)
	if err!=nil{
		fmt.Println("Error1")
		return ;
	}
	bint,err=strconv.Atoi(b)
	if err!=nil{
		fmt.Println("Error2")
		return;

	}
	var c int = aint+bint
	fmt.Printf("parafunction output is:%d",c);
}

func main(){
	err := shim.Start(new(SimpleAsset));
	if err != nil{
		fmt.Printf("Error on main function %s",err)
	}
}