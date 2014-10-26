package core;

public enum OperationStep {
	ADD_TICKET_BEGIN (Operation.ADD_TICKET),
	ADD_TICKET_2 (Operation.ADD_TICKET),
	ADD_TICKET_END (Operation.ADD_TICKET),

	REMOVE_TICKET_BEGIN (Operation.REMOVE_TICKET),
	REMOVE_TICKET_2 (Operation.REMOVE_TICKET),
	REMOVE_TICKET_END (Operation.REMOVE_TICKET);
	
	private Operation op;
	
	OperationStep(Operation value){
		op = value;
	}
	
	public Operation getOp(){
		return op;
	}
	
	public enum Operation {
		ADD_TICKET,
		REMOVE_TICKET
	}
}
