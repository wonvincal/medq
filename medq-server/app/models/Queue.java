package models;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import core.Algo;
import core.QueueEvent;
import core.QueueEventListener;

/***
 * NOT Thread safe
 * 
 * Two types of queue: 1) backed by a Schedule, 2) not back by a schedule
 * For 1), details such as "owner" can be retrieved from Schedule (configurable)
 * For 2), details would be Queue specific.
 * 
 * A Queue's output can also be a Queue's input (configurable, can be done on subscription)
 * For example, output of a consultation {@link}Queue can be input to a billing Queue
 * 
 * An algo can subscribe to a queue's output event as well.
 * 
 * @author Calvin
 *
 */
public class Queue {
	private String name;
	
	// TODO - Some configurable parameters
	private	long perTicketWaitingTimeBuffer;
	private int durationPerSlotInSecond;
	private int numTicketPerSlot;
	
	private final BlockingQueue<QueueEvent> events;
	private final Set<QueueEventListener> listeners;
	
	// An Algo may not be part of a Queue
	private Algo algo;
	
	public String toString(){
		return name;
	}
	
	public Algo getAlgo(){
		return algo;
	}
	
	public void setAlgo(Algo value){
		algo = value;
	}
	
	public String getName(){
		return name;
	}
	
	public long getPerTicketWaitingTimeBuffer(){
		return perTicketWaitingTimeBuffer;
	}
	
	public boolean subscribe(QueueEventListener value){
		return listeners.add(value);
	}
	
	public boolean unsubscribe(QueueEventListener value){
		return listeners.remove(value);
	}
	
	private Queue(Builder builder){
		name = builder.name;
		perTicketWaitingTimeBuffer = builder.perTicketWaitingTimeBuffer;
		
		// A crude way to estimate the size of the ArrayBlockingQueue
		// @TODO - To find out which BlockingQueue to use
		events = new ArrayBlockingQueue<QueueEvent>(builder.maxTicketsInQueue * 5);
		// @TODO - since listeners do change often, we should use a CopyOnWriteSet instead
		listeners = new HashSet<QueueEventListener>();
	}
	
	public void add(QueueEvent event){
		events.add(event);
	}
	
	public static class Builder {
		// Required parameters
		private String name;
		
		// Optional parameters - initialized to default values
		private long perTicketWaitingTimeBuffer = 0;
		private int maxTicketsInQueue = 100;
		
		public Builder(String name){
			this.name = name;
		}
		
		public Builder perTicketWaitingTimeBuffer(long value){
			perTicketWaitingTimeBuffer = value;
			return this;
		}
		
		public Builder maxTicketsInQueue(int value){
			maxTicketsInQueue = value;
			return this;
		}

		public Queue build(){
			return new Queue(this);
		}
	}
}
