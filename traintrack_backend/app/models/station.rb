class Station < ApplicationRecord
  has_many :lines, through: :station_lines
  has_many :trains, through: :lines
  # has_many :comments
end
