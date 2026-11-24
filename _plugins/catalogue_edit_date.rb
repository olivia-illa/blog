require 'open3'
require 'time'

module CatalogueEditDateFilter
  def catalogue_edit_date(paths)
    source = @context.registers[:site].source
    date, status = Open3.capture2(
      'git', '-c', "safe.directory=#{source}", 'log', '-1', '--format=%cI',
      '--', *Array(paths), chdir: source, err: File::NULL
    )
    date.strip if status.success? && !date.empty?
  rescue Errno::ENOENT
    nil
  end

  def catalogue_recently_edited(entries)
    entries.each_with_index.sort_by do |entry, index|
      date = catalogue_edit_date(entry.fetch('paths'))
      [date ? -Time.iso8601(date).to_i : Float::INFINITY, index]
    end.map(&:first)
  end
end

Liquid::Template.register_filter(CatalogueEditDateFilter)
