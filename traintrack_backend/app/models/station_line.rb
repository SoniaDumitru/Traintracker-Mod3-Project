class StationLine < ApplicationRecord
  belongs_to :line
  belongs_to :station
end
