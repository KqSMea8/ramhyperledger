package main

import (
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sam "github.com/hyperledger/fabric/protos/peer"
)

type Student struct {
}

type StudentDB struct {
	SId                           int
	Sname, SFname, class, Address string
}

var Students map[int]string

var length int = 0

var l int

var idArray []int

func (s Student) Init(stub shim.ChaincodeStubInterface) sam.Response {

	fmt.Println("Hai")
	return shim.Success([]byte("Welcome"))

}

func (s Student) Invoke(stub shim.ChaincodeStubInterface) sam.Response {
	var function, args = stub.GetFunctionAndParameters()

	if function == "addStudent" {
		return s.addStudent(stub, args)
	}

	if function == "get" {
		return s.get(stub, args)
	}

	if function == "getlength" {
		return shim.Success([]byte(strconv.Itoa(length)))

	}

	return shim.Success([]byte("Welcome"))

}

func (s Student) addStudent(stub shim.ChaincodeStubInterface, args []string) sam.Response {

	Students = make(map[int]string)
	var Id int = s.getId()
	Students[Id] = strconv.Itoa(Id) + " - " + args[1] + " - " + args[2] + " - " + args[3] + " - " + args[4]
	fmt.Println("Added")

	return shim.Success([]byte(nil))

}

func (s Student) get(stub shim.ChaincodeStubInterface, args []string) sam.Response {
	Id, _ := strconv.Atoi(args[0])
	fmt.Println(Students[Id])
	return shim.Success([]byte(Students[Id]))
}

func (s Student) getId() int {
	length = length + 1
	return length
}

func main() {
	err := shim.Start(new(Student))
	if err != nil {
		fmt.Printf("\nError in creatign: %s", err)
	}
}
