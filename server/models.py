from database import Base
from geojson import Feature
from geojson import Point
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship


class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)

    tile_id = Column(Integer, ForeignKey("tiles.id"))
    tile = relationship("Tile", back_populates="detections")

    width = Column(Float)
    length = Column(Float)

    latitude = Column(Float)
    longitude = Column(Float)

    pixel_x = Column(Integer)
    pixel_y = Column(Integer)

    def to_geojson(self):
        return Feature(
            geometry=Point((self.longitude, self.latitude)),
            properties={"id": self.id, "width": self.width, "length": self.length},
        )

    def __repr__(self):
        return f"<Detection(id={self.id}, tile_id={self.tile_id}, width={self.width}, length={self.length}, latitude={self.latitude}, longitude={self.longitude}, pixel_x={self.pixel_x}, pixel_y={self.pixel_y})>"


class Tile(Base):
    __tablename__ = "tiles"

    id = Column(Integer, primary_key=True, index=True)
    detections = relationship("Detection", order_by=Detection.id, back_populates="tile")

    input_path = Column(String)
    dataset = Column(String)
    descriptor = Column(String)

    orbit_type = Column(String)

    image_width = Column(Integer)
    image_height = Column(Integer)

    acquisition_time = Column(DateTime)
    esa_processed_time = Column(DateTime)
    processed_time = Column(DateTime)

    top_left_latitude = Column(Float)
    top_left_longitude = Column(Float)
    bottom_right_latitude = Column(Float)
    bottom_right_longitude = Column(Float)

    def __repr__(self):
        return (
            f"<Tile(id={self.id}, input_path={self.input_path}, dataset={self.dataset},"
            f" descriptor={self.descriptor}, orbit_type={self.orbit_type},"
            f" image_width={self.image_width}, image_height={self.image_height},"
            f" acquisition_time={self.acquisition_time}, esa_processed_time={self.esa_processed_time},"
            f" processed_time={self.processed_time}, top_left_latitude={self.top_left_latitude},"
            f" top_left_longitude={self.top_left_longitude}, bottom_right_latitude={self.bottom_right_latitude},"
            f" bottom_right_longitude={self.bottom_right_longitude}, number_of_detections={len(self.detections)})>"
        )