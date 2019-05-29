class Train < ApplicationRecord
  belongs_to :line
  has_many :stations, through: :lines

  # has_many :comments

end
