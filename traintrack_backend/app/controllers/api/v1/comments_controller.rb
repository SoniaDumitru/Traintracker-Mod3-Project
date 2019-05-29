class Api::V1::CommentsController < ApplicationController
  before_action :find_comment, only: [:show]

  def index
    @comments = Comment.all
    render json: @comments
  end

  def show
    @comment = Comment.find(params[:id])
    render json: @comment 
  end

  def create
    @comment = Comment.new(comment_params)
    if @comment.save
      render json: @comment
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:content, :stationNum)
  end

  def find_comment
    @comment = Comment.find(params[:id])
  end

end
