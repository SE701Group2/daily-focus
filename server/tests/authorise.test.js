const admin = require("firebase-admin");
const authorise = require("../utils/auth");
const token = "MyToken";

const validBearerToken = {
    headers: {
        authorization: `Bearer ${token}`,
    },
};

const noBearerPrefixToken = {
    headers: {
        authorization: token,
    },
};

const {
    shortPasswordErrorMessage,
    mockToken,
    mockUid,
    invalidEmailErrorMessage,
    UnauthorizedErrorMessage,
} = require("../mocks/mockFirebase");

jest.mock("firebase-admin", () => {
    const { mockFirebase } = require("../mocks/mockFirebase");
    return mockFirebase;
});

describe("authorisation tests  ", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("when a valid bearer token is given to firebase is the expected UUID returned", async () => {
        const returnedUUID = await authorise(validBearerToken);

        expect(returnedUUID).toEqual(mockUid);
        expect(admin.auth).toHaveBeenCalled();
        expect(admin.auth().verifyIdToken).toHaveBeenCalledWith(token);
    });

    it("Token is given without Bearer prefix expects empty string", async () => {
        const returnedUUID = await authorise(noBearerPrefixToken);
        expect(returnedUUID).toEqual("");
    });
});
