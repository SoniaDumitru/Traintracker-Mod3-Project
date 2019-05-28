class Line < ApplicationRecord
  has_many :trains
  has_many :stations, through: :station_lines
end
