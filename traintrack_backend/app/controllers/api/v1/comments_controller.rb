class Api::V1::CommentsController < ApplicationController
  before_action :find_comment, only: [:show]
  
  def index
    @comments = Comment.all
    render json: @comments
  end
  private

  def comment_params
    params.require(:comment).permit(:content, :train_id, :station_id)
  end

  def find_comment
    @comment = Comment.find(params[:id])
  end

end
