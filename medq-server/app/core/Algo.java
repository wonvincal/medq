package core;

import models.Queue;

public class Algo implements QueueEventListener {
	
	private Queue queue;

	@Override
	public void receive(QueueEvent event) {
		// TODO Auto-generated method stub
		
		// Add some event to queue
		QueueEvent otherEvent = null;
		queue.add(otherEvent);
	}
	
	// TODO - Some Timer Event
	public void receive(TimerEvent event){
		// Add some event to queue
		QueueEvent otherEvent = null;
		queue.add(otherEvent);
	}
	
}
