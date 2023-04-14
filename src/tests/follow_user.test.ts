describe("Feature: following user", function () {
  let fixture: Fixtures;

  beforeEach(() => {
    fixture = createFixtures();
  });

  test("Alice can follow Bob", async function () {
    fixture.givenUserFollowees({ user: "Alice", followees: ["Charlie"] });
    fixture.whenUserFollows({ user: "Alice", userToFollow: "Bob" });
    await fixture.thenUserFolloweesAre({
      user: "Alice",
      followees: ["Charlie", "Bob"],
    });
  });
});

const createFixtures = () => {
  return {
    givenUserFollowees: ({
      user,
      followees,
    }: {
      user: string;
      followees: string[];
    }) => {},
    whenUserFollows: ({
      user,
      userToFollow,
    }: {
      user: string;
      userToFollow: string;
    }) => {},
    thenUserFolloweesAre: ({
      user,
      followees,
    }: {
      user: string;
      followees: string[];
    }) => {},
  };
};

type Fixtures = ReturnType<typeof createFixtures>;
