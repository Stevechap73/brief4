class Listing {
  constructor(
    title,
    orgnizer,
    releaseDate,
    startTime,
    descriptionTrip,
    nbPlaces,
    appointmentAddress,
    memberId,
    createdAt,
    status
  ) {
    this.title = title;
    this.orgnizer = orgnizer;
    this.releaseDate = releaseDate;
    this.startTime = startTime;
    this.descriptionTrip = descriptionTrip;
    this.nbPlaces = nbPlaces;
    this.appointmentAddress = appointmentAddress;
    this.memberId = memberId;
    this.createdAt = createdAt;
    this.status = status;
  }
}
module.exports = { Listing };
