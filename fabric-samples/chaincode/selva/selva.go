package main
import (
	"fmt"
	// "strconv"	

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type ram struct {

}

func (t *ram) Init(stub shim.ChaincodeStubInterface) peer.Response{
	return shim.Success(nil)

}

func (t *ram) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn, args := stub.GetFunctionAndParameters()
	if fn == "get"{
		return  getdata(stub,args);
	}
	if fn=="put"{
		return putData(stub,args)
	}
	fmt.Println(args)
	return shim.Success(nil)
}

func getdata(APIstub shim.ChaincodeStubInterface,args []string) peer.Response{
	result, _ := APIstub.GetState(args[0])
	return shim.Success(result)
}

func putData(APIstub shim.ChaincodeStubInterface,args []string) peer.Response{
	APIstub.PutState(args[0], []byte(args[1]))
	return shim.Success(nil)
}
func main(){
	err := shim.Start(new(ram));
	if err != nil{
		fmt.Printf("Error on main function %s",err)
	}
}