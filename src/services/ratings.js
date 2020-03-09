const moment = require("moment");

const sortingMethods = {
  default: messages => {
    return messages.sort((msg1, msg2) =>
      msg1.reactionCount < msg2.reactionCount ? 1 : -1
    );
  },
  hot: messages => {
    // The DConstant is the most important part of this calculation process.
    // Hence, this was left out for the moment until we understand the
    // significance of this constant in an emprical way.
    const dConstant = 0;
    const now = moment();

    const calculateCommunityScore = msg => {
      let commentFactor = 0;
      if (msg.replyUsersCount) {
        commentFactor = msg.replyCount / msg.replyUsersCount;
      }
      return (
        (2 * commentFactor + msg.reactionCount) /
        (dConstant + now.diff(moment(msg.timestamp)))
      );
    };

    return messages.sort((msg1, msg2) => {
      msg1.rating = calculateCommunityScore(msg1);
      msg2.rating = calculateCommunityScore(msg2);

      return msg1.rating < msg2.rating ? 1 : -1;
    });
  },
  latest: messages => {
    return messages.sort((msg1, msg2) =>
      msg1.timestamp < msg2.timestamp ? 1 : -1
    );
  }
};

module.exports.sortByRating = (sortingMethod, messages) => {
  sortingMethod = sortingMethod ? sortingMethod.toLowerCase() : "default";
  if (typeof sortingMethods[sortingMethod] !== "function") {
    sortingMethod = "default";
  }
  return sortingMethods[sortingMethod](messages);
};
