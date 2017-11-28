import {BitArray, Debug, Hashtable, NString, NNumber, IHashCode} from "@magic/mscorelib";
import {Logger} from "@magic/utils";

// This class is used to manage the user rights on the client side. It is updated with
// data from the server, and can be used to get the user rights without calling the server
export class UserRights {
  /* Suppose, host ctl has 2 rights and comp ctl has 3 rights.                     */
  /* In this case, size of rights_ is 6 (0th is unused).                           */
  /* So, the rights_ has the following look 0 H1 H2 C1 C2 C3.                      */
  /* Suppose, C2 is used in the Host CTL.                                          */
  /* Now, if C1 is not exposed, the RealIdx of the C2 is 3 (H1, H2, C2)            */
  /* But its corresponding entry in the rights_ is at 4th position.                */
  /* So, we do not have direct mapping between the RealIdx and rights_.            */
  /* RichClient does not have all the information by which it can determine the    */
  /* correct index in the rights_.                                                 */
  /* So, the server should send it the map.                                        */
  /* This map will contain CtlIdx, RealIdx and IndexInUserRights_.                 */
  /* Each entry in the map will be delimited by a ';'.                             */
  /* And then whole map will be appended to the rights (again delimited by a ';'). */
  /* So, the token before the first ';' will be the rights_ and the other would be */
  /* the rights map.                                                               */
  /* Now, client can simply get the index in right_ from the map and use it.       */
  /* On client, this map will be saved as a HashTable.                             */
  /* The key would be a combination of the CtlIdx and RealIdx bundled in RightKey  */
  /* class.                                                                        */

  private _rights: BitArray = null;
  private _rightsTab: Hashtable<RightKey, number> = null;
  static RightsChanged: () => void = null;
  RightsHashKey: string = null;

  private static OnRightsChanged(): void {
    if (UserRights.RightsChanged !== null) {
      UserRights.RightsChanged();
    }
  }

  /// <summary>
  ///
  /// </summary>
  constructor() {
    this._rights = new BitArray(0);
    this._rightsTab = new Hashtable();
    this.RightsHashKey = "";
  }

  getRight(ctlIdx: number, realIdx: number): boolean {
    let hasRight: boolean = false;
    if (realIdx === 0 || realIdx > this._rights.Length)
      Logger.Instance.WriteExceptionToLog("UserRights.getRight(): bad index");
    else {
      let rightKey: RightKey = new RightKey(ctlIdx, realIdx);
      let indexInRights: number = <number>this._rightsTab.get_Item(rightKey);
      hasRight = this._rights.Get(indexInRights);
    }
    return hasRight;
  }

  // Get the user rights data string, as sent by the server, and fill the user rights array
  fillUserRights(rights: string): void {

    // Start by reseting all rights to false
    this._rights.SetAll(false);
    this._rightsTab.Clear();

    // Even if project doesn't have any right, rights string is not blank
    Debug.Assert(NString.Trim(rights).length > 0);

    // The first token in the rights is the userRights.
    // The second one is the rights ISNs hash.
    // And, the third onwards, is the map between CtlIdx. RealIdx and index in the userRights.
    let userRights: string[] = rights.split(";");

    let parsedRights: string[] = userRights[0].split(',');
    // the 1st comma delimited value is the maximum number of rights possible for the user, considering all opened applications
    this._rights = new BitArray(NNumber.Parse(parsedRights[0]));

    // Loop on user rights, set them if they are found, else turn them off
    for (let i: number = 1; i < parsedRights.length; i++) {
      let idx: number = NNumber.Parse(parsedRights[i]);
      try {
        this._rights.Set(idx, true);
      }
      catch (err) {
        Logger.Instance.WriteWarningToLog("(Temp)Backwards compatibility between client >= 1.8.1.341 and server <= 1.8.1.340");

        this._rights.SetAll(false);
        this._rightsTab.Clear();

        parsedRights.forEach(function (item) {
          idx = NNumber.Parse(item);
          if (idx >= this._rights.Length)
            this._rights.Length = idx + 1;
          this._rights.Set(idx, true);
        });
        break;
      }

    }
    this.setRightsHashKey(userRights[1]);

    for (let i: number = 2; i < userRights.length; i++) {

      let userRight: string[] = userRights[i].split(",");

      Debug.Assert(userRight.length === 3);

      let rightKey: RightKey = new RightKey(NNumber.Parse(userRight[0]), NNumber.Parse(userRight[1]));

      this._rightsTab.Add(rightKey, NNumber.Parse(userRight[2]));
    }
  }

  /// <summary> Sets the RightsHashKey and raises RightsChanged event, if needed.
  /// </summary>
  /// <param name="newRights">- new rights hash code value</param>
  setRightsHashKey(newRights: string): void {
    newRights = newRights.trim();
    if (this.RightsHashKey !== newRights) {
      this.RightsHashKey = newRights;
      UserRights.OnRightsChanged();
    }
  }
}

export class RightKey implements IHashCode {
  static currentHashCode = 0;
  private _ctlIdx: number = 0;
  private _realIdx: number = 0;
  hashCode: number;

  constructor(ctlIdx: number, realIdx: number) {
    this._ctlIdx = ctlIdx;
    this._realIdx = realIdx;
  }

  public GetHashCode(): number {
    return this.hashCode;
  }
}
