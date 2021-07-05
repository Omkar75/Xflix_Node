const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      throw new ApiError(httpStatus.NOT_FOUND, "Invalid Mongo Id")
    }
    return value;
  };

export default objectId;