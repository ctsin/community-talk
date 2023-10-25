type Evt =
  | {
      type: "SIGN_IN";
      payload: {
        userID: string;
      };
    }
  | { type: "SIGN_OUT" };

declare function sendEvent(eventType: any, payload?: any): void;

// Correct
sendEvent("SIGN_OUT");
sendEvent("SIGN_IN", { userID: "123" });

// Should Error
sendEvent("SIGN_OUT", {});
sendEvent("SIGN_IN", { userID: 123 });
sendEvent("SIGN_IN", {});
sendEvent("SIGN_IN");
