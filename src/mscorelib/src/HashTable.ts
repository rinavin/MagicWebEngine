// Reference: https://github.com/rkostrzewski/hashtable-ts/blob/master/src/hashtable.ts

import {Array_Enumerator} from "./ArrayEnumerator";
import {Exception} from "./Exception";

export interface IHashCode
{
	GetHashCode(): number;
}

type BucketElement<TKey, TValue> = { key: TKey, value: TValue };
type Bucket<TKey, TValue> = [BucketElement<TKey, TValue>];

const HashTableLoadFactor = 0.75;

// Hashtable implementation for key TKey and Value TValue
export class Hashtable<TKey extends (IHashCode | string | number), TValue>
{
	
	private _buckets: Bucket<TKey, TValue>[] = []; // total no. of buckets
	private _elementsCount                   = 0; // total elements
	private _bucketCount: number;
	private _loadFactor: number;
	
	constructor(bucketCount: number = 8, loadFactor: number = HashTableLoadFactor) {
		this._bucketCount = bucketCount;
		this._loadFactor  = loadFactor;
		
		if (this._bucketCount % 2 !== 0)
		{
			throw new Exception('Bucket count must be a positive number and be multiple of 2.');
		}
	}
	
	// Generic Hash funtion
	private HashFunction(key): number {
		if (typeof key.GetHashCode === 'function')
		{
			return key.GetHashCode();
		}
		else if (key.constructor === String)
		{
			return this.GetHashForStringType(key);
		}
		else if (key.constructor === Number)
		{
			return key;
		}
		return 0;
	}
	
	// returns hashCode for string type
	private GetHashForStringType(key: string): number {
		let hash = 0;
		if (key.length === 0)
		{
			return hash;
		}
		
		for (let i = 0; i < key.length; i++)
		{
			let char = key.charCodeAt(i);
			hash     = ((hash << 5) - hash) + char;
			hash     = hash & hash; // Convert to 32bit integer
		}
		return hash;
	}
	
	// returns elementCount
	get Count() {
		return this._elementsCount;
	}
	
	// returns ValueCollection (Array Enumerator)
	get Values(): Array_Enumerator<TValue> {
		let array: Array<TValue> = [];
		this._buckets.forEach(b => b.forEach(item => {
			array.push(item.value);
		}));
		return new Array_Enumerator(array);
	}
	
	// returns KeyCollection (Array Enumerator)
	get Keys(): Array_Enumerator<TKey> {
		let array: Array<TKey> = [];
		this._buckets.forEach(b => b.forEach(item => {
			array.push(item.key);
		}));
		return new Array_Enumerator(array);
	}
	
	// adds item to Hashtable
	Add(key: TKey, value: TValue): void {
		this.Insert(key, value, true);
	}
	
	// sets item in Hashtable
	set_Item(key: TKey, value: TValue) {
		this.Insert(key, value, false);
	}
	
	// Insert element in Hashtable
	private Insert(key: TKey, value: TValue, add: boolean): void {
		let bucketIndex = this.GetBucketIndex(key);
		
		if (!this._buckets[bucketIndex])
		{
			this._buckets[bucketIndex] = <Bucket<TKey, TValue>>[];
		}
		
		if (this._buckets[bucketIndex].find(x => x.key === key))
		{
			if (add)
			{
				throw new Exception('Item with provided key already exists!');
			}
			else
			{
				this.Remove(key);
			}
		}
		
		this._buckets[bucketIndex].push({key: key, value: value});
		
		this._elementsCount++;
		if (this._elementsCount > this._bucketCount * this._loadFactor)
		{
			this.Resize(this._bucketCount * 2);
		}
	}
	
	// Gets value for key TKey
	get_Item(key: TKey): TValue {
		let bucketIndex = this.GetBucketIndex(key);
		let bucket      = this._buckets[bucketIndex];
		if (!bucket)
		{
			return null;
		}
		
		let item = bucket.find(x => x.key === key);
		if (item)
		{
			return item.value;
		}
		
		return null;
	}
	
	// Returns if key TKey is present in Hashtable
	ContainsKey(key: TKey): boolean {
		let bucketIndex = this.GetBucketIndex(key);
		let bucket      = this._buckets[bucketIndex];
		if (!bucket)
		{
			return false;
		}
		
		let itemIndex = bucket.findIndex(x => x.key === key);
		return (itemIndex > -1);
	}
	
	// Removes item with key TKey from Hashtable
	Remove(key: TKey) {
		let bucketIndex = this.GetBucketIndex(key);
		let bucket      = this._buckets[bucketIndex];
		if (!bucket)
		{
			return;
		}
		
		let itemIndex = bucket.findIndex(x => x.key === key);
		if (itemIndex > -1)
		{
			bucket.splice(itemIndex, 1);
			this._elementsCount--;
			if (this._elementsCount <= this._bucketCount * (1 - this._loadFactor))
			{
				this.Resize(this._bucketCount / 2);
			}
		}
	}
	
	// Resize bucket (Hashtable)
	private Resize(newBucketCount: number) {
		let _oldBuckets     = this._buckets;
		this._elementsCount = 0;
		this._buckets       = [];
		this._bucketCount   = newBucketCount;
		
		_oldBuckets.forEach(b => b.forEach(item => this.Add(item.key, item.value)));
	}
	
	// returns bucketIndex for key
	private GetBucketIndex(key: TKey) {
		let hash = this.HashFunction(key);
		if (hash % 1 !== 0)
		{
			throw new Exception('Key\'s hash must be an integer!');
		}
		
		let index = Math.abs(hash) % this._bucketCount;
		
		if (index < 0 || index >= this._bucketCount)
		{
			throw new Exception('Index exceeds bucket boundaries');
		}
		
		return index;
	}
	
	// Clears Hashtable
	Clear(): void {
		this._elementsCount = 0;
		this._buckets       = [];
	}
}
